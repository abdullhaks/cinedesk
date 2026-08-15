import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'CINEDESK PRO - Enterprise Film Production Platform API',
    version: '1.0.0',
    description: `
## 🎬 CINEDESK PRO API Documentation

Welcome to the **CINEDESK PRO** REST API documentation. CINEDESK PRO is a comprehensive, production-grade enterprise platform designed for film studio management, contractor onboarding workflows, resource allocation, and financial compliance.

### 🔐 Authentication & Authorization
- **Authentication**: JWT Bearer Token (Authorization Header: \`Bearer <access_token>\`) or Refresh Cookie for token renewals.
- **RBAC**: Fine-grained role and permission matrix. Protected endpoints require specific permissions or resource ownership.

### 🌐 Base URLs
- **Local Dev Server**: \`http://localhost:3000\`
- **Swagger Documentation UI**: \`http://localhost:3000/apidocs\`
    `,
    contact: {
      name: 'CINEDESK Engineering Support',
      email: 'dev@cinedeskpro.internal',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local Development Server (Port 3000)',
    },
    {
      url: 'http://localhost:5000',
      description: 'Alternative Port / Staging Server',
    },
  ],
  tags: [
    { name: '1. Authentication', description: 'User login, registration, contractor sign-up, JWT lifecycle, and session management.' },
    { name: '2. Role-Based Access Control (RBAC)', description: 'System and custom roles, permissions discovery, and privilege matrix assignment.' },
    { name: '3. Contractor Onboarding Workflow', description: 'Multi-step contractor onboarding: Personal, Professional, Tax/Bank, and Compliance documents review.' },
    { name: '4. User Management', description: 'Internal user registry, role reassignments, and account status controls.' },
    { name: '5. Production Management', description: 'Feature films / series project lifecycle, budget allocation, cast, crew, and characters.' },
    { name: '6. Location Scouting & Booking', description: 'Filming locations registry, permits, media uploads, and reservation conflict detection.' },
    { name: '7. Fund Requests & Approvals', description: 'Budget drawdown requests, multi-tier approvals, disbursement logs, and self-approval guards.' },
    { name: '8. Costume & Wardrobe Management', description: 'Wardrobe assets, sizing, checkouts, returns, actor assignments, and condition tracking.' },
    { name: '9. Audit Logs', description: 'Immutable activity tracking and security audit logs across all platform operations.' },
    { name: '10. Notifications', description: 'In-app real-time alerts, review notices, and status change subscriptions.' },
    { name: '11. Dashboard & Analytics', description: 'Executive KPIs, budget utilization, production milestones, and pending approval metrics.' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Provide your JWT access token (format: "Bearer <token>")',
      },
    },
    schemas: {
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          message: { type: 'string', example: 'Operation completed successfully' },
          data: { type: 'object' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Resource not found or unauthorized' },
          errors: {
            type: 'array',
            items: { type: 'string' },
            example: ['Invalid email format', 'Password must be at least 8 characters'],
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d1e' },
          name: { type: 'string', example: 'John Director' },
          email: { type: 'string', format: 'email', example: 'director@cinedesk.com' },
          phone: { type: 'string', example: '+1 555 123 4567' },
          role: {
            type: 'object',
            properties: {
              _id: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d20' },
              name: { type: 'string', example: 'Production Manager' },
              permissions: { type: 'array', items: { type: 'string' }, example: ['productions.view', 'productions.create'] },
            },
          },
          isActive: { type: 'boolean', example: true },
          avatar: { type: 'string', example: 'https://res.cloudinary.com/cinedesk/image/upload/v1/avatar.jpg' },
          createdAt: { type: 'string', format: 'date-time', example: '2026-08-01T10:00:00.000Z' },
        },
      },
      Role: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d20' },
          name: { type: 'string', example: 'Costume Designer' },
          description: { type: 'string', example: 'Manages wardrobe inventory, assignments, and returns' },
          isSystem: { type: 'boolean', example: false },
          permissions: {
            type: 'array',
            items: { type: 'string' },
            example: ['costumes.view', 'costumes.create', 'costumes.update', 'costumes.assign'],
          },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Permission: {
        type: 'object',
        properties: {
          key: { type: 'string', example: 'funds.approve' },
          label: { type: 'string', example: 'Approve / Reject Fund Requests' },
          category: { type: 'string', example: 'funds' },
          description: { type: 'string', example: 'Permission to review and approve budget disbursement requests' },
        },
      },
      OnboardingApplication: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d30' },
          user: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d1e' },
          status: {
            type: 'string',
            enum: ['draft', 'pending_review', 'approved', 'rejected', 'changes_requested'],
            example: 'pending_review',
          },
          currentStep: { type: 'number', example: 4 },
          personalInfo: {
            type: 'object',
            properties: {
              fullName: { type: 'string', example: 'Jane Stunt' },
              dob: { type: 'string', format: 'date', example: '1992-04-15' },
              emergencyContact: { type: 'string', example: '+1 555 999 8888' },
            },
          },
          professionalInfo: {
            type: 'object',
            properties: {
              department: { type: 'string', example: 'Stunts & Choreography' },
              primarySkill: { type: 'string', example: 'Precision Driving' },
              experienceYears: { type: 'number', example: 7 },
              unionMember: { type: 'boolean', example: true },
            },
          },
          taxInfo: {
            type: 'object',
            properties: {
              taxIdNumber: { type: 'string', example: 'XX-XXXXXXX' },
              taxClassification: { type: 'string', example: '1099 Contractor / LLC' },
            },
          },
          bankInfo: {
            type: 'object',
            properties: {
              bankName: { type: 'string', example: 'Chase Bank' },
              accountNumberMasked: { type: 'string', example: '**** 4321' },
              routingNumber: { type: 'string', example: '021000021' },
            },
          },
          documents: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                docType: { type: 'string', example: 'id_card' },
                fileUrl: { type: 'string', example: 'https://res.cloudinary.com/.../doc.pdf' },
                fileName: { type: 'string', example: 'passport_scan.pdf' },
                uploadedAt: { type: 'string', format: 'date-time' },
              },
            },
          },
          reviewNotes: { type: 'string', example: 'Verified SAG-AFTRA membership.' },
        },
      },
      Production: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d40' },
          title: { type: 'string', example: 'The Cyber Heist' },
          code: { type: 'string', example: 'CYBER-2026' },
          genre: { type: 'string', example: 'Sci-Fi Thriller' },
          synopsis: { type: 'string', example: 'A master hacker tries to prevent an AI meltdown.' },
          status: {
            type: 'string',
            enum: ['development', 'pre_production', 'production', 'post_production', 'wrapped', 'archived'],
            example: 'production',
          },
          startDate: { type: 'string', format: 'date', example: '2026-09-01' },
          endDate: { type: 'string', format: 'date', example: '2026-12-15' },
          budget: { type: 'number', example: 5000000 },
          productionManager: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d1e' },
          cast: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                user: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d55' },
                characterName: { type: 'string', example: 'Commander Shepard' },
                roleType: { type: 'string', example: 'Lead' },
              },
            },
          },
          crew: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                user: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d56' },
                department: { type: 'string', example: 'Cinematography' },
                position: { type: 'string', example: 'Director of Photography' },
              },
            },
          },
        },
      },
      Location: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d60' },
          name: { type: 'string', example: 'Grand Canyon North Studio' },
          address: { type: 'string', example: '100 Desert Vista Way' },
          city: { type: 'string', example: 'Flagstaff' },
          state: { type: 'string', example: 'AZ' },
          country: { type: 'string', example: 'USA' },
          dailyRate: { type: 'number', example: 3500 },
          capacity: { type: 'number', example: 150 },
          amenities: { type: 'array', items: { type: 'string' }, example: ['Power Generators', 'Parking', 'Catering Base'] },
          status: { type: 'string', enum: ['available', 'booked', 'maintenance', 'pending_approval'], example: 'available' },
          images: { type: 'array', items: { type: 'string' }, example: ['https://res.cloudinary.com/.../loc1.jpg'] },
          bookings: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                production: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d40' },
                startDate: { type: 'string', format: 'date', example: '2026-09-10' },
                endDate: { type: 'string', format: 'date', example: '2026-09-15' },
                bookedBy: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d1e' },
              },
            },
          },
        },
      },
      FundRequest: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d70' },
          production: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d40' },
          requestedBy: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d1e' },
          amount: { type: 'number', example: 12500 },
          category: {
            type: 'string',
            enum: ['camera_equipment', 'location_permit', 'wardrobe_props', 'catering', 'travel_lodging', 'stunt_safety', 'miscellaneous'],
            example: 'camera_equipment',
          },
          purpose: { type: 'string', example: 'Anamorphic lens rental package for desert night sequences' },
          urgency: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'], example: 'high' },
          status: {
            type: 'string',
            enum: ['draft', 'submitted', 'approved', 'rejected', 'disbursed'],
            example: 'submitted',
          },
          approvals: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                approvedBy: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d99' },
                action: { type: 'string', enum: ['approved', 'rejected'], example: 'approved' },
                comment: { type: 'string', example: 'Approved as per Phase 2 budget.' },
                timestamp: { type: 'string', format: 'date-time' },
              },
            },
          },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Costume: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d80' },
          code: { type: 'string', example: 'COST-SF-004' },
          name: { type: 'string', example: 'Tactical Exo-Vest (Distressed)' },
          category: { type: 'string', example: 'Sci-Fi / Armored' },
          era: { type: 'string', example: 'Futuristic 2085' },
          size: { type: 'string', example: 'L' },
          color: { type: 'string', example: 'Matte Charcoal & Neon Blue' },
          condition: { type: 'string', enum: ['mint', 'good', 'worn', 'damaged', 'cleaning'], example: 'good' },
          status: { type: 'string', enum: ['available', 'assigned', 'cleaning', 'repair', 'retired'], example: 'available' },
          photoUrl: { type: 'string', example: 'https://res.cloudinary.com/.../vest.jpg' },
          assignedTo: {
            type: 'object',
            properties: {
              production: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d40' },
              character: { type: 'string', example: 'Commander Shepard' },
              actor: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d55' },
              assignedAt: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
      AuditLog: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d90' },
          user: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d1e' },
          action: { type: 'string', example: 'FUND_REQUEST_APPROVED' },
          entity: { type: 'string', example: 'FundRequest' },
          entityId: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d70' },
          details: { type: 'object', example: { amount: 12500, previousStatus: 'submitted', newStatus: 'approved' } },
          ipAddress: { type: 'string', example: '127.0.0.1' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Notification: {
        type: 'object',
        properties: {
          _id: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0da0' },
          user: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d1e' },
          title: { type: 'string', example: 'Fund Request Approved' },
          message: { type: 'string', example: 'Your request for Anamorphic lens rental ($12,500) has been approved.' },
          type: { type: 'string', enum: ['info', 'success', 'warning', 'action_required'], example: 'success' },
          link: { type: 'string', example: '/finance/requests/66a12b3c4d5e6f7a8b9c0d70' },
          isRead: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      DashboardStats: {
        type: 'object',
        properties: {
          totalProductions: { type: 'number', example: 12 },
          activeProductions: { type: 'number', example: 5 },
          totalFundsRequested: { type: 'number', example: 450000 },
          totalFundsDisbursed: { type: 'number', example: 380000 },
          pendingFundApprovals: { type: 'number', example: 4 },
          pendingOnboardingReviews: { type: 'number', example: 7 },
          totalCostumes: { type: 'number', example: 120 },
          costumesAssigned: { type: 'number', example: 45 },
          totalLocations: { type: 'number', example: 30 },
          activeBookings: { type: 'number', example: 8 },
        },
      },
    },
  },
  paths: {
    // ==========================================
    // 1. AUTHENTICATION
    // ==========================================
    '/api/auth/register': {
      post: {
        tags: ['1. Authentication'],
        summary: 'Register Internal User (Admin/Staff only)',
        description: 'Creates a standard internal user with defined role.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Alex Turner' },
                  email: { type: 'string', format: 'email', example: 'alex@cinedesk.com' },
                  password: { type: 'string', format: 'password', example: 'Password123!' },
                  phone: { type: 'string', example: '+1 555 333 4444' },
                  roleId: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d20' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'User registered successfully', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          400: { description: 'Validation error or email already exists', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/auth/register-contractor': {
      post: {
        tags: ['1. Authentication'],
        summary: 'Public Contractor Registration & Onboarding Initiation',
        description: 'Registers a new external contractor account and automatically assigns the Contractor role and creates a draft onboarding application.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Marcus Vance' },
                  email: { type: 'string', format: 'email', example: 'marcus.vance@cineworks.io' },
                  password: { type: 'string', format: 'password', example: 'SecureContractorPass2026!' },
                  phone: { type: 'string', example: '+1 555 777 9999' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Contractor registered and logged in', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          400: { description: 'Validation failed or duplicate contractor account', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
        },
      },
    },
    '/api/auth/signup-contractor': {
      post: {
        tags: ['1. Authentication'],
        summary: 'Contractor Signup (Alias)',
        description: 'Alias route matching /register-contractor.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Marcus Vance' },
                  email: { type: 'string', format: 'email', example: 'marcus.vance@cineworks.io' },
                  password: { type: 'string', format: 'password', example: 'SecureContractorPass2026!' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Contractor account registered successfully' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['1. Authentication'],
        summary: 'User Login & Token Generation',
        description: 'Authenticates credentials, returns short-lived JWT access token in response and sets HTTP-only refresh token cookie.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'director@cinedesk.com' },
                  password: { type: 'string', format: 'password', example: 'Password123!' },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Authentication successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'object',
                      properties: {
                        accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsIn...' },
                        user: { $ref: '#/components/schemas/User' },
                      },
                    },
                  },
                },
              },
            },
          },
          401: { description: 'Invalid email or password' },
        },
      },
    },
    '/api/auth/refresh': {
      post: {
        tags: ['1. Authentication'],
        summary: 'Refresh JWT Access Token',
        description: 'Validates HTTP-only refresh token cookie and issues a fresh JWT access token without re-prompting login.',
        responses: {
          200: { description: 'New access token issued successfully' },
          401: { description: 'Refresh token expired or invalid' },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['1. Authentication'],
        security: [{ bearerAuth: [] }],
        summary: 'Logout & Invalidate Session',
        description: 'Clears HTTP-only refresh token cookie and terminates active session.',
        responses: {
          200: { description: 'Successfully logged out' },
        },
      },
    },
    '/api/auth/me': {
      get: {
        tags: ['1. Authentication'],
        security: [{ bearerAuth: [] }],
        summary: 'Get Current Authenticated User Profile',
        description: 'Returns profile details, assigned role, and populated permission keys for the currently authenticated user.',
        responses: {
          200: {
            description: 'User profile retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/User' },
                  },
                },
              },
            },
          },
          401: { description: 'Unauthorized' },
        },
      },
    },

    // ==========================================
    // 2. ROLES & PERMISSIONS
    // ==========================================
    '/api/roles/permissions': {
      get: {
        tags: ['2. Role-Based Access Control (RBAC)'],
        security: [{ bearerAuth: [] }],
        summary: 'List All System Permissions',
        description: 'Returns the catalog of all system permissions grouped by domain (productions, funds, costumes, locations, onboarding, etc.). Requires `roles.view`.',
        responses: {
          200: {
            description: 'Permissions catalog',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Permission' } },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/roles': {
      get: {
        tags: ['2. Role-Based Access Control (RBAC)'],
        security: [{ bearerAuth: [] }],
        summary: 'List All Roles',
        description: 'Returns all system and custom roles with populated permission keys. Requires `roles.view`.',
        responses: {
          200: {
            description: 'Roles list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Role' } },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['2. Role-Based Access Control (RBAC)'],
        security: [{ bearerAuth: [] }],
        summary: 'Create Custom Role',
        description: 'Defines a new custom role with designated permission keys. Requires `roles.manage`.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'permissions'],
                properties: {
                  name: { type: 'string', example: 'Sound Supervisor' },
                  description: { type: 'string', example: 'Oversees on-set audio recording and Foley design' },
                  permissions: { type: 'array', items: { type: 'string' }, example: ['productions.view', 'funds.request'] },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Role created successfully' },
          400: { description: 'Role name already exists' },
        },
      },
    },
    '/api/roles/{id}/permissions': {
      patch: {
        tags: ['2. Role-Based Access Control (RBAC)'],
        security: [{ bearerAuth: [] }],
        summary: 'Update Role Permissions Matrix',
        description: 'Modifies the assigned permission keys for a specific role. Requires `roles.manage`.',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Role MongoDB ObjectId' },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['permissions'],
                properties: {
                  permissions: { type: 'array', items: { type: 'string' }, example: ['productions.view', 'productions.create', 'locations.view'] },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Role permissions updated successfully' },
        },
      },
    },

    // ==========================================
    // 3. CONTRACTOR ONBOARDING WORKFLOW
    // ==========================================
    '/api/onboarding/my-application': {
      get: {
        tags: ['3. Contractor Onboarding Workflow'],
        security: [{ bearerAuth: [] }],
        summary: "Get Current Contractor's Application",
        description: "Retrieves the authenticated contractor's onboarding application and step progress.",
        responses: {
          200: {
            description: 'Contractor application found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/OnboardingApplication' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/onboarding': {
      post: {
        tags: ['3. Contractor Onboarding Workflow'],
        security: [{ bearerAuth: [] }],
        summary: 'Create Draft Onboarding Application',
        description: 'Creates a new draft application if no non-rejected application currently exists.',
        responses: {
          201: { description: 'Draft application created' },
          400: { description: 'An active application already exists' },
        },
      },
      get: {
        tags: ['3. Contractor Onboarding Workflow'],
        security: [{ bearerAuth: [] }],
        summary: 'List All Contractor Applications (Admin/Reviewer)',
        description: 'Lists contractor onboarding applications with optional status and search filters. Requires `onboarding.review`.',
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['draft', 'pending_review', 'approved', 'rejected', 'changes_requested'] } },
          { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Search by contractor name or email' },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          200: { description: 'List of contractor applications' },
        },
      },
    },
    '/api/onboarding/upload': {
      post: {
        tags: ['3. Contractor Onboarding Workflow'],
        security: [{ bearerAuth: [] }],
        summary: 'Upload Document / ID / Tax Form',
        description: 'Uploads contractor verification documents (PDF, PNG, JPG) to Cloudinary media storage.',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['file'],
                properties: {
                  file: { type: 'string', format: 'binary', description: 'Document file' },
                  docType: { type: 'string', example: 'id_card', description: 'id_card, tax_w9, cert, bank_void_check' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Document uploaded successfully' },
        },
      },
    },
    '/api/onboarding/{id}/step/{stepName}': {
      put: {
        tags: ['3. Contractor Onboarding Workflow'],
        security: [{ bearerAuth: [] }],
        summary: 'Save Step Data (1: Personal, 2: Professional, 3: Tax/Bank, 4: Compliance)',
        description: 'Saves granular step data on the onboarding application.',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'stepName', in: 'path', required: true, schema: { type: 'string', enum: ['personal', 'professional', 'tax', 'bank', 'compliance'] } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { type: 'object' },
            },
          },
        },
        responses: {
          200: { description: 'Step data saved successfully' },
        },
      },
    },
    '/api/onboarding/{id}/submit': {
      post: {
        tags: ['3. Contractor Onboarding Workflow'],
        security: [{ bearerAuth: [] }],
        summary: 'Submit Application for Review',
        description: 'Transitions application state from `draft` / `changes_requested` to `pending_review`.',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Application submitted for review' },
        },
      },
    },
    '/api/onboarding/{id}': {
      get: {
        tags: ['3. Contractor Onboarding Workflow'],
        security: [{ bearerAuth: [] }],
        summary: 'Get Application Details by ID',
        description: 'Retrieves complete application details. Allowed for applicant owner or users with `onboarding.review`.',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Application details' },
        },
      },
    },
    '/api/onboarding/{id}/review': {
      patch: {
        tags: ['3. Contractor Onboarding Workflow'],
        security: [{ bearerAuth: [] }],
        summary: 'Review Application (Approve, Reject, Request Changes)',
        description: 'Production manager or admin reviews the application. Requires `onboarding.review`.',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['decision'],
                properties: {
                  decision: { type: 'string', enum: ['approve', 'reject', 'request_changes'], example: 'approve' },
                  notes: { type: 'string', example: 'All certifications and insurance valid.' },
                  assignedRoleId: { type: 'string', description: 'Optional role assignment upon approval' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Application reviewed successfully' },
        },
      },
    },

    // ==========================================
    // 4. USER MANAGEMENT
    // ==========================================
    '/api/users': {
      get: {
        tags: ['4. User Management'],
        security: [{ bearerAuth: [] }],
        summary: 'List Users with Pagination & Filtering',
        description: 'Returns list of users with populated roles. Requires `users.view`.',
        parameters: [
          { name: 'role', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'isActive', in: 'query', schema: { type: 'boolean' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
        ],
        responses: {
          200: { description: 'Users list' },
        },
      },
    },
    '/api/users/{id}': {
      get: {
        tags: ['4. User Management'],
        security: [{ bearerAuth: [] }],
        summary: 'Get User by ID',
        description: 'Returns detailed user information. Requires `users.view`.',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'User record' },
        },
      },
    },
    '/api/users/{id}/role': {
      patch: {
        tags: ['4. User Management'],
        security: [{ bearerAuth: [] }],
        summary: 'Assign Role to User',
        description: 'Updates assigned role of user. Requires `users.assign_role`.',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['roleId'],
                properties: {
                  roleId: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d20' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'User role updated' },
        },
      },
    },
    '/api/users/{id}/deactivate': {
      patch: {
        tags: ['4. User Management'],
        security: [{ bearerAuth: [] }],
        summary: 'Toggle User Active Status',
        description: 'Activates or deactivates a user account. Requires `users.deactivate`.',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  isActive: { type: 'boolean', example: false },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'User status updated' },
        },
      },
    },

    // ==========================================
    // 5. PRODUCTION MANAGEMENT
    // ==========================================
    '/api/productions': {
      get: {
        tags: ['5. Production Management'],
        security: [{ bearerAuth: [] }],
        summary: 'List Productions',
        description: 'Lists all production projects. Requires `productions.view`.',
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'List of productions' },
        },
      },
      post: {
        tags: ['5. Production Management'],
        security: [{ bearerAuth: [] }],
        summary: 'Create New Production',
        description: 'Creates a film/series production project. Requires `productions.create`.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'code', 'budget', 'startDate'],
                properties: {
                  title: { type: 'string', example: 'Apex Protocol' },
                  code: { type: 'string', example: 'APEX-2026' },
                  genre: { type: 'string', example: 'Action / Espionage' },
                  synopsis: { type: 'string', example: 'Covert operatives track a rogue intelligence unit across Europe.' },
                  budget: { type: 'number', example: 12000000 },
                  startDate: { type: 'string', format: 'date', example: '2026-10-01' },
                  endDate: { type: 'string', format: 'date', example: '2027-02-28' },
                  productionManager: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d1e' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Production created successfully' },
        },
      },
    },
    '/api/productions/{id}': {
      get: {
        tags: ['5. Production Management'],
        security: [{ bearerAuth: [] }],
        summary: 'Get Production Details',
        description: 'Returns production details with populated cast, crew, and manager. Requires `productions.view`.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Production details' } },
      },
      put: {
        tags: ['5. Production Management'],
        security: [{ bearerAuth: [] }],
        summary: 'Update Production',
        description: 'Updates production project details. Requires production manager ownership or `productions.update`.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object' } } },
        },
        responses: { 200: { description: 'Production updated' } },
      },
      delete: {
        tags: ['5. Production Management'],
        security: [{ bearerAuth: [] }],
        summary: 'Delete Production',
        description: 'Deletes a production project. Requires `productions.delete`.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Production deleted' } },
      },
    },
    '/api/productions/{id}/cast': {
      post: {
        tags: ['5. Production Management'],
        security: [{ bearerAuth: [] }],
        summary: 'Assign Cast Member to Production',
        description: 'Assigns an actor/performer to a character in this production. Requires `productions.update`.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['userId', 'characterName'],
                properties: {
                  userId: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d55' },
                  characterName: { type: 'string', example: 'Captain Reynolds' },
                  roleType: { type: 'string', example: 'Lead' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Cast member assigned' } },
      },
      delete: {
        tags: ['5. Production Management'],
        security: [{ bearerAuth: [] }],
        summary: 'Remove Cast Member from Production',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['userId'],
                properties: { userId: { type: 'string' } },
              },
            },
          },
        },
        responses: { 200: { description: 'Cast member removed' } },
      },
    },
    '/api/productions/{id}/crew': {
      post: {
        tags: ['5. Production Management'],
        security: [{ bearerAuth: [] }],
        summary: 'Assign Crew Member to Production',
        description: 'Assigns a crew member to a department/position in this production. Requires `productions.update`.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['userId', 'department', 'position'],
                properties: {
                  userId: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d56' },
                  department: { type: 'string', example: 'Lighting & Grip' },
                  position: { type: 'string', example: 'Gaffer' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Crew member assigned' } },
      },
      delete: {
        tags: ['5. Production Management'],
        security: [{ bearerAuth: [] }],
        summary: 'Remove Crew Member from Production',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['userId'],
                properties: { userId: { type: 'string' } },
              },
            },
          },
        },
        responses: { 200: { description: 'Crew member removed' } },
      },
    },
    '/api/productions/{id}/characters': {
      post: {
        tags: ['5. Production Management'],
        security: [{ bearerAuth: [] }],
        summary: 'Create Script Character for Production',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string', example: 'Agent Sterling' },
                  description: { type: 'string', example: 'Undercover interpol operative' },
                  costumeRequirements: { type: 'string', example: 'Tactical suits, formal gala attire' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Character created' } },
      },
      get: {
        tags: ['5. Production Management'],
        security: [{ bearerAuth: [] }],
        summary: 'List Characters for Production',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'List of characters' } },
      },
    },

    // ==========================================
    // 6. LOCATION SCOUTING & BOOKING
    // ==========================================
    '/api/locations/upload': {
      post: {
        tags: ['6. Location Scouting & Booking'],
        security: [{ bearerAuth: [] }],
        summary: 'Upload Location Media / Permit Document',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['file'],
                properties: { file: { type: 'string', format: 'binary' } },
              },
            },
          },
        },
        responses: { 200: { description: 'File uploaded' } },
      },
    },
    '/api/locations': {
      get: {
        tags: ['6. Location Scouting & Booking'],
        security: [{ bearerAuth: [] }],
        summary: 'List Filming Locations',
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'city', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Locations list' } },
      },
      post: {
        tags: ['6. Location Scouting & Booking'],
        security: [{ bearerAuth: [] }],
        summary: 'Create New Location',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'address', 'city', 'dailyRate'],
                properties: {
                  name: { type: 'string', example: 'Neon Rooftop Lounge' },
                  address: { type: 'string', example: '450 Skyline Blvd' },
                  city: { type: 'string', example: 'Los Angeles' },
                  state: { type: 'string', example: 'CA' },
                  country: { type: 'string', example: 'USA' },
                  dailyRate: { type: 'number', example: 5000 },
                  capacity: { type: 'number', example: 200 },
                  amenities: { type: 'array', items: { type: 'string' }, example: ['Helipad', 'Catering Kitchen'] },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Location created' } },
      },
    },
    '/api/locations/{id}': {
      get: {
        tags: ['6. Location Scouting & Booking'],
        security: [{ bearerAuth: [] }],
        summary: 'Get Location Details',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Location details' } },
      },
      put: {
        tags: ['6. Location Scouting & Booking'],
        security: [{ bearerAuth: [] }],
        summary: 'Update Location Details',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { 200: { description: 'Location updated' } },
      },
      delete: {
        tags: ['6. Location Scouting & Booking'],
        security: [{ bearerAuth: [] }],
        summary: 'Delete Location',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Location deleted' } },
      },
    },
    '/api/locations/{id}/book': {
      post: {
        tags: ['6. Location Scouting & Booking'],
        security: [{ bearerAuth: [] }],
        summary: 'Book Location Date Range (With Conflict Detection)',
        description: 'Reserves a location for a production schedule, automatically checking against existing overlapping reservations.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['productionId', 'startDate', 'endDate'],
                properties: {
                  productionId: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d40' },
                  startDate: { type: 'string', format: 'date', example: '2026-11-01' },
                  endDate: { type: 'string', format: 'date', example: '2026-11-05' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Location booked successfully' },
          409: { description: 'Schedule conflict detected for requested date range' },
        },
      },
    },
    '/api/locations/{id}/approve': {
      patch: {
        tags: ['6. Location Scouting & Booking'],
        security: [{ bearerAuth: [] }],
        summary: 'Approve Location for Production Use',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Location approved' } },
      },
    },

    // ==========================================
    // 7. FUND REQUESTS & APPROVALS
    // ==========================================
    '/api/fund-requests': {
      get: {
        tags: ['7. Fund Requests & Approvals'],
        security: [{ bearerAuth: [] }],
        summary: 'List Fund Requests',
        description: 'Lists fund drawdown requests with status, production, and category filters. Requires `funds.view`.',
        parameters: [
          { name: 'productionId', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'List of fund requests' } },
      },
      post: {
        tags: ['7. Fund Requests & Approvals'],
        security: [{ bearerAuth: [] }],
        summary: 'Create Fund Request Draft',
        description: 'Creates a draft fund request. Requires `funds.request`.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['productionId', 'amount', 'category', 'purpose'],
                properties: {
                  productionId: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d40' },
                  amount: { type: 'number', example: 8500 },
                  category: { type: 'string', example: 'camera_equipment' },
                  purpose: { type: 'string', example: 'High-speed Phantom Flex 4K camera rental' },
                  urgency: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'], example: 'medium' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Fund request created' } },
      },
    },
    '/api/fund-requests/{id}': {
      get: {
        tags: ['7. Fund Requests & Approvals'],
        security: [{ bearerAuth: [] }],
        summary: 'Get Fund Request Details',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Fund request details' } },
      },
      delete: {
        tags: ['7. Fund Requests & Approvals'],
        security: [{ bearerAuth: [] }],
        summary: 'Delete Draft Fund Request',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Fund request deleted' } },
      },
    },
    '/api/fund-requests/{id}/submit': {
      post: {
        tags: ['7. Fund Requests & Approvals'],
        security: [{ bearerAuth: [] }],
        summary: 'Submit Fund Request for Manager Review',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Fund request submitted' } },
      },
    },
    '/api/fund-requests/{id}/approve': {
      patch: {
        tags: ['7. Fund Requests & Approvals'],
        security: [{ bearerAuth: [] }],
        summary: 'Approve Fund Request (With Self-Approval Guard)',
        description: 'Approves a submitted fund request. Enforces strict enterprise compliance rule: requesters cannot approve their own requests. Requires `funds.approve`.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { comment: { type: 'string', example: 'Approved within budget line item.' } },
              },
            },
          },
        },
        responses: {
          200: { description: 'Fund request approved' },
          403: { description: 'Self-approval is strictly prohibited' },
        },
      },
    },
    '/api/fund-requests/{id}/reject': {
      patch: {
        tags: ['7. Fund Requests & Approvals'],
        security: [{ bearerAuth: [] }],
        summary: 'Reject Fund Request',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['reason'],
                properties: { reason: { type: 'string', example: 'Amount exceeds allocated quota.' } },
              },
            },
          },
        },
        responses: { 200: { description: 'Fund request rejected' } },
      },
    },
    '/api/fund-requests/{id}/disburse': {
      patch: {
        tags: ['7. Fund Requests & Approvals'],
        security: [{ bearerAuth: [] }],
        summary: 'Mark Fund Request as Disbursed/Paid',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Funds marked as disbursed' } },
      },
    },

    // ==========================================
    // 8. COSTUME & WARDROBE MANAGEMENT
    // ==========================================
    '/api/costumes/upload': {
      post: {
        tags: ['8. Costume & Wardrobe Management'],
        security: [{ bearerAuth: [] }],
        summary: 'Upload Costume Photo',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['file'],
                properties: { file: { type: 'string', format: 'binary' } },
              },
            },
          },
        },
        responses: { 200: { description: 'Photo uploaded' } },
      },
    },
    '/api/costumes': {
      get: {
        tags: ['8. Costume & Wardrobe Management'],
        security: [{ bearerAuth: [] }],
        summary: 'List Costumes Inventory',
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'size', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'Costumes list' } },
      },
      post: {
        tags: ['8. Costume & Wardrobe Management'],
        security: [{ bearerAuth: [] }],
        summary: 'Create New Costume Item',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['code', 'name', 'category', 'size', 'color'],
                properties: {
                  code: { type: 'string', example: 'COST-MED-012' },
                  name: { type: 'string', example: '18th Century Velvet Frock Coat' },
                  category: { type: 'string', example: 'Period / Regency' },
                  era: { type: 'string', example: '1790s' },
                  size: { type: 'string', example: 'M' },
                  color: { type: 'string', example: 'Deep Emerald Green' },
                  condition: { type: 'string', example: 'mint' },
                },
              },
            },
          },
        },
        responses: { 201: { description: 'Costume item created' } },
      },
    },
    '/api/costumes/{id}': {
      get: {
        tags: ['8. Costume & Wardrobe Management'],
        security: [{ bearerAuth: [] }],
        summary: 'Get Costume Details',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Costume details' } },
      },
      put: {
        tags: ['8. Costume & Wardrobe Management'],
        security: [{ bearerAuth: [] }],
        summary: 'Update Costume Item',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { 200: { description: 'Costume updated' } },
      },
      delete: {
        tags: ['8. Costume & Wardrobe Management'],
        security: [{ bearerAuth: [] }],
        summary: 'Delete Costume Item',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Costume deleted' } },
      },
    },
    '/api/costumes/{id}/assign': {
      post: {
        tags: ['8. Costume & Wardrobe Management'],
        security: [{ bearerAuth: [] }],
        summary: 'Assign Costume to Actor / Character',
        description: 'Assigns an available costume to a specific actor and character within a production project.',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['productionId', 'character', 'actorId'],
                properties: {
                  productionId: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d40' },
                  character: { type: 'string', example: 'Lord Harrington' },
                  actorId: { type: 'string', example: '66a12b3c4d5e6f7a8b9c0d55' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Costume assigned' } },
      },
    },
    '/api/costumes/{id}/return': {
      post: {
        tags: ['8. Costume & Wardrobe Management'],
        security: [{ bearerAuth: [] }],
        summary: 'Return Costume Item & Update Condition',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  condition: { type: 'string', enum: ['mint', 'good', 'worn', 'damaged', 'cleaning'], example: 'cleaning' },
                  notes: { type: 'string', example: 'Dry cleaning required after rain scene.' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Costume marked as returned' } },
      },
    },

    // ==========================================
    // 9. AUDIT LOGS
    // ==========================================
    '/api/audit-logs': {
      get: {
        tags: ['9. Audit Logs'],
        security: [{ bearerAuth: [] }],
        summary: 'List Security & Operation Audit Logs',
        description: 'Lists immutable chronological audit records for compliance and tracing. Requires `audit_logs.view`.',
        parameters: [
          { name: 'entity', in: 'query', schema: { type: 'string' }, description: 'FundRequest, Production, User, etc.' },
          { name: 'userId', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 25 } },
        ],
        responses: { 200: { description: 'Audit trail records' } },
      },
    },

    // ==========================================
    // 10. NOTIFICATIONS
    // ==========================================
    '/api/notifications': {
      get: {
        tags: ['10. Notifications'],
        security: [{ bearerAuth: [] }],
        summary: "List Current User's Notifications",
        description: 'Returns in-app notifications and alerts.',
        responses: { 200: { description: 'User notifications' } },
      },
    },
    '/api/notifications/{id}/read': {
      patch: {
        tags: ['10. Notifications'],
        security: [{ bearerAuth: [] }],
        summary: 'Mark Notification as Read',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { 200: { description: 'Notification marked read' } },
      },
    },
    '/api/notifications/read-all': {
      patch: {
        tags: ['10. Notifications'],
        security: [{ bearerAuth: [] }],
        summary: 'Mark All Notifications as Read',
        responses: { 200: { description: 'All notifications marked read' } },
      },
    },

    // ==========================================
    // 11. DASHBOARD & ANALYTICS
    // ==========================================
    '/api/dashboard/stats': {
      get: {
        tags: ['11. Dashboard & Analytics'],
        security: [{ bearerAuth: [] }],
        summary: 'Get Executive Platform Dashboard Metrics & KPIs',
        description: 'Returns statistical aggregates across active productions, budget allocations, pending approvals, wardrobe, and locations.',
        responses: {
          200: {
            description: 'Platform KPI summary metrics',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/DashboardStats' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

const options: swaggerJSDoc.Options = {
  definition: swaggerDefinition,
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
