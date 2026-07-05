# MENDIC Project Backlog & Roadmap

## 📋 Future Enhancements & Features

### 1. Automated Technician Email Notifications
- **Status**: Backlog (Pending third-party API & domain setup)
- **Priority**: Medium
- **Description**: Automatically notify technicians via Email when an admin approves their KYC application or when a new repair order is broadcast in their area.
- **Technical Plan**:
  - **Email**: Integrate **Resend** or **Cloudflare Email Service** into `worker/src/index.js` inside the `PATCH /api/admin/mechanics/:id/verify` route.
- **Prerequisites**: Verify sender domain DNS records (SPF/DKIM/DMARC) and add API tokens to Cloudflare Workers secrets (`wrangler secret put RESEND_API_KEY`).
