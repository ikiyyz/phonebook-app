# Phonebook App

A modern phonebook application built with Next.js, Prisma, and Redux Toolkit. This application allows users to manage contacts with features like browse, read, edit, add, delete, sorting, and pagination.

## Features

- 📞 **Contact Management**: Add, edit, delete, and view contacts
- 🔍 **Search**: Search contacts by name or phone number
- 📊 **Pagination**: Navigate through large contact lists
- 🔄 **Sorting**: Sort contacts alphabetically (A-Z or Z-A)
- 🖼️ **Avatar Support**: Upload and display contact photos
- 🎨 **Modern UI**: Clean and responsive design with Tailwind CSS
- 🚀 **Real-time Updates**: State management with Redux Toolkit

## Tech Stack

- **Frontend**: Next.js 15.3.3, React 19, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Testing**: Playwright (E2E)

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd phonebook-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/phonebook_db"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Phonebooks

- `GET /api/phonebooks` - Get all phonebooks with pagination, search, and sorting
- `GET /api/phonebooks/[id]` - Get a specific phonebook by ID
- `POST /api/phonebooks` - Create a new phonebook
- `PUT /api/phonebooks/[id]` - Update a phonebook
- `DELETE /api/phonebooks/[id]` - Delete a phonebook

### Query Parameters

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `keyword` (string): Search term for name or phone
- `sort` (string): Sort order - 'asc' or 'desc' (default: 'asc')

### Example Request

```bash
GET http://localhost:3000/api/phonebooks?page=1&limit=10&keyword=john&sort=asc
```

### Example Response

```json
{
  "phonebooks": [
    {
      "id": 1,
      "name": "John Doe",
      "phone": "081234567890",
      "avatar": "avatar1.png",
      "createdAt": "2023-06-18T13:24:34.685Z",
      "updatedAt": "2023-06-18T13:24:34.685Z"
    }
  ],
  "page": 1,
  "limit": 10,
  "pages": 5,
  "total": 50
}
```

## Project Structure

```
phonebook-app/
├── 📁 prisma/                 # Database schema and migrations
├── 📁 public/                 # Static assets
├── 📁 src/
│   ├── 📁 api/               # API client utilities
│   ├── 📁 app/               # Next.js App Router
│   │   ├── 📁 api/           # API routes
│   │   │   └── 📁 phonebooks/ # Phonebook endpoints
│   │   └── page.js           # Main phonebook page
│   ├── 📁 components/        # Reusable React components
│   ├── 📁 lib/               # Database connection (Prisma)
│   ├── 📁 redux/             # State management
│   ├── 📁 utils/             # Helper functions
│   └── middleware.js         # Route protection
└── 📁 e2e/                   # End-to-end tests
```

## Testing

### E2E Testing

This project uses Playwright for end-to-end testing.

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Show test report
npm run test:e2e:report
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
