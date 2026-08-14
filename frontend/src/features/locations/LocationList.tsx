import React, { useState, useEffect } from 'react';
import { locationApi } from '../../services/apis/locationApi';
import { productionApi } from '../../services/apis/productionApi';
import type { LocationItem } from '../../interfaces/location';
import type { Production } from '../../interfaces/production';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSkeleton, ErrorState } from '../../components/common/States';
import { Can } from '../../components/auth/Can';
import { PERMISSIONS } from '../../constants/permissions';
import { MapPin, Plus, Calendar, CheckCircle2, Eye, Globe } from 'lucide-react';
import { Modal, Drawer, message, Input, DatePicker, Select } from 'antd';

export const LocationList: React.FC = () => {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [productions, setProductions] = useState<Production[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');

  // Create Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newLocName, setNewLocName] = useState('');
  const [newLocAddress, setNewLocAddress] = useState('');
  const [newLat, setNewLat] = useState(34.0522);
  const [newLng, setNewLng] = useState(-118.2437);
  const [newNotes, setNewNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Detail / Booking Drawer
  const [selectedLoc, setSelectedLoc] = useState<LocationItem | null>(null);
  const [bookingProductionId, setBookingProductionId] = useState('');
  const [bookingDates, setBookingDates] = useState<[any, any] | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const fetchLocations = async () => {
    setLoading(true);
    setError(null);
    try {
      const [locsRes, prodsRes] = await Promise.all([
        locationApi.listLocations({ status: statusFilter }),
        productionApi.listProductions(),
      ]);
      setLocations(locsRes.items || []);
      setProductions(prodsRes.items || []);
    } catch (err: any) {
      setError('Failed to load shooting locations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, [statusFilter]);

  const handleCreateLocation = async () => {
    if (!newLocName.trim() || !newLocAddress.trim()) {
      message.warning('Please enter a location name and address.');
      return;
    }
    setSubmitting(true);
    try {
      await locationApi.createLocation({
        name: newLocName.trim(),
        address: newLocAddress.trim(),
        lat: Number(newLat),
        lng: Number(newLng),
        notes: newNotes,
      });
      message.success(`Location "${newLocName}" created!`);
      setIsCreateOpen(false);
      setNewLocName('');
      setNewLocAddress('');
      await fetchLocations();
    } catch (err: any) {
      message.error('Failed to create location.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookLocation = async () => {
    if (!selectedLoc || !bookingProductionId || !bookingDates) {
      message.warning('Please select a production and date range.');
      return;
    }
    setBookingLoading(true);
    try {
      await locationApi.bookLocation(selectedLoc._id, {
        productionId: bookingProductionId,
        startDate: bookingDates[0].toISOString(),
        endDate: bookingDates[1].toISOString(),
      });
      message.success('Location successfully booked!');
      setBookingProductionId('');
      setBookingDates(null);
      // Refresh detail & list
      const updatedLoc = await locationApi.getLocationById(selectedLoc._id);
      setSelectedLoc(updatedLoc);
      await fetchLocations();
    } catch (err: any) {
      // Show conflict 409 error message clearly per acceptance checklist!
      message.error(err.response?.data?.message || 'Location booking failed.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleApproveLocation = async () => {
    if (!selectedLoc) return;
    try {
      await locationApi.approveLocation(selectedLoc._id);
      message.success('Location approved!');
      const updatedLoc = await locationApi.getLocationById(selectedLoc._id);
      setSelectedLoc(updatedLoc);
      await fetchLocations();
    } catch (err: any) {
      message.error('Failed to approve location.');
    }
  };

  const columns = [
    {
      key: 'name',
      title: 'Location Name',
      render: (_: any, record: LocationItem) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <MapPin size={18} className="text-blue-600" />
          </div>
          <div>
            <div className="font-bold text-slate-900">{record.name}</div>
            <div className="text-[11px] text-slate-400">{record.address}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (_: any, record: LocationItem) => <StatusBadge status={record.status} />,
    },
    {
      key: 'coordinates',
      title: 'Coordinates (Lat / Lng)',
      render: (_: any, record: LocationItem) => (
        <div className="text-xs text-slate-600 flex items-center gap-1 font-mono">
          <Globe size={13} className="text-slate-400" />
          <span>{record.coordinates?.lat || 0}, {record.coordinates?.lng || 0}</span>
        </div>
      ),
    },
    {
      key: 'bookingsCount',
      title: 'Bookings',
      render: (_: any, record: LocationItem) => (
        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
          {record.bookingCalendar?.length || 0} Booked Ranges
        </span>
      ),
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_: any, record: LocationItem) => (
        <button
          onClick={() => setSelectedLoc(record)}
          className="flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Eye size={13} /> View & Book
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Shooting Locations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Film set locations, permit statuses, and booking calendar reservations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="Requested">Requested</option>
            <option value="Approved">Approved</option>
            <option value="Booked">Booked</option>
          </select>

          <Can permission={PERMISSIONS.LOCATIONS_CREATE}>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus size={16} /> Add Location
            </button>
          </Can>
        </div>
      </div>

      {/* Table */}
      {loading ? <LoadingSkeleton rows={5} /> : error ? <ErrorState message={error} onRetry={fetchLocations} /> : <DataTable columns={columns} data={locations} rowKey="_id" />}

      {/* Create Modal */}
      <Modal
        title="Register New Location"
        open={isCreateOpen}
        onCancel={() => setIsCreateOpen(false)}
        onOk={handleCreateLocation}
        confirmLoading={submitting}
        okText="Add Location"
      >
        <div className="py-4 space-y-4">
          <div>
            <label className="label-caps-grey block mb-1.5">Location Name *</label>
            <Input
              value={newLocName}
              onChange={(e) => setNewLocName(e.target.value)}
              placeholder="e.g. Pinewood Stage A"
            />
          </div>

          <div>
            <label className="label-caps-grey block mb-1.5">Full Address *</label>
            <Input
              value={newLocAddress}
              onChange={(e) => setNewLocAddress(e.target.value)}
              placeholder="123 Studio Way, Los Angeles, CA"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-caps-grey block mb-1.5">Latitude</label>
              <Input type="number" value={newLat} onChange={(e) => setNewLat(Number(e.target.value))} />
            </div>
            <div>
              <label className="label-caps-grey block mb-1.5">Longitude</label>
              <Input type="number" value={newLng} onChange={(e) => setNewLng(Number(e.target.value))} />
            </div>
          </div>

          <div>
            <label className="label-caps-grey block mb-1.5">Notes & Access Info</label>
            <Input.TextArea rows={2} value={newNotes} onChange={(e) => setNewNotes(e.target.value)} />
          </div>
        </div>
      </Modal>

      {/* Location Detail & Booking Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-2 text-base font-bold text-slate-900">
            <MapPin size={20} className="text-blue-600" />
            <span>{selectedLoc?.name}</span>
          </div>
        }
        open={!!selectedLoc}
        onClose={() => setSelectedLoc(null)}
        width={560}
      >
        {selectedLoc && (
          <div className="space-y-6 text-xs">
            {/* Header info */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="label-caps-grey">STATUS</span>
                <div className="mt-1">
                  <StatusBadge status={selectedLoc.status} />
                </div>
              </div>
              <div className="text-right">
                <span className="label-caps-grey">ADDRESS</span>
                <div className="font-semibold text-slate-800 text-xs mt-1 max-w-xs">{selectedLoc.address}</div>
              </div>
            </div>

            {/* Approval button if Requested */}
            {selectedLoc.status === 'Requested' && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                <span className="text-amber-800 font-semibold">Location is pending approval</span>
                <button
                  onClick={handleApproveLocation}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1"
                >
                  <CheckCircle2 size={14} /> Approve Location
                </button>
              </div>
            )}

            {/* Reserve Date Range Form */}
            <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-2xl space-y-3">
              <h3 className="font-bold text-sm text-blue-900 flex items-center gap-1.5">
                <Calendar size={16} /> Reserve Location for Production
              </h3>

              <div>
                <label className="label-caps-grey block mb-1">Select Production *</label>
                <Select
                  className="w-full"
                  placeholder="Select film title..."
                  value={bookingProductionId}
                  onChange={(val) => setBookingProductionId(val)}
                  options={productions.map((p) => ({
                    value: p._id,
                    label: p.title,
                  }))}
                />
              </div>

              <div>
                <label className="label-caps-grey block mb-1">Booking Date Range *</label>
                <DatePicker.RangePicker
                  className="w-full"
                  onChange={(dates) => setBookingDates(dates as any)}
                />
              </div>

              <button
                onClick={handleBookLocation}
                disabled={bookingLoading}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-xs"
              >
                {bookingLoading ? 'Checking Availability...' : 'Confirm Booking'}
              </button>
            </div>

            {/* Booking Calendar List */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                Existing Booking Calendar ({selectedLoc.bookingCalendar?.length || 0})
              </h3>

              <div className="space-y-2">
                {selectedLoc.bookingCalendar?.map((booking, idx) => (
                  <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-800">
                        {typeof booking.production === 'object' ? (booking.production as any).title : 'Film Production'}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Calendar size={12} />
                        <span>
                          {new Date(booking.startDate).toLocaleDateString()} &ndash; {new Date(booking.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      RESERVED
                    </span>
                  </div>
                ))}
                {(!selectedLoc.bookingCalendar || selectedLoc.bookingCalendar.length === 0) && (
                  <div className="text-slate-400 italic py-2 text-center">No bookings reserved yet.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
