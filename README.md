# GlobalMerchant 🚀
### Premium Multi-Tenant E-Commerce Platform

GlobalMerchant is a sophisticated, state-of-the-art e-commerce ecosystem designed for scale. It features a robust **Multi-Tenant Architecture** where each merchant operates on their own dedicated subdomain (e.g., `electronics.localhost:3000`), ensuring complete data isolation and a branded experience.

---

## ✨ Core Features

### 🏢 Multi-Tenancy & Subdomains
- **Tenant Isolation**: Each merchant has their own isolated data environment.
- **Dynamic Routing**: Automatic subdomain detection and request rewriting.
- **Merchant Provisioning**: One-click onboarding for new vendors including user, store, and subdomain setup.

### 🛡️ Unified Admin Control
- **Users Management**: Complete control over platform roles (Admins, Merchants, Customers).
- **Merchant Oversight**: Approve, suspend, or provision new merchant stores from a central dashboard.
- **Global Analytics**: High-level overview of platform revenue, user growth, and merchant performance.

### 🏪 Merchant Empowerment
- **Branded Dashboards**: Dedicated portal for vendors to manage their business.
- **Store Customization**: Merchants can edit their store's design, colors, and branding.
- **Inventory & Orders**: Full-featured product management and order fulfillment tracking.
- **Revenue Insights**: Granular analytics and sales reports for each individual store.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | [Next.js 14](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) |
| **Backend** | [Django](https://www.djangoproject.com/) & [Django REST Framework](https://www.django-rest-framework.org/) |
| **Database** | [MongoDB](https://www.mongodb.com/) (via Djongo) or PostgreSQL |
| **Authentication** | JWT (JSON Web Tokens) with Role-Based Access Control |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- MongoDB / PostgreSQL

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure `.env`:
   ```env
   DATABASE_URL=...
   SECRET_KEY=...
   ```
5. Run migrations and start server:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🗺️ Roadmap
- [x] Multi-tenant architecture with subdomain support.
- [x] Admin dashboard with user/merchant management.
- [x] Merchant dashboard with inventory and orders.
- [ ] Integration with Stripe for global payments.
- [ ] AI-driven product recommendations.
- [ ] Mobile application for merchants.

---

## 📄 License
This project is licensed under the MIT License.
