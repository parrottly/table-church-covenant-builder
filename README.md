# Community Covenant Builder

A web application that helps small group leaders create customized community covenants by selecting from dropdown options or editing text directly.

## Features

- Clean, user-friendly web interface with form fields for different covenant sections
- Dropdown menus with pre-written options for common covenant elements
- Ability to customize/edit any selected text  
- Real-time preview of the covenant as it's being built
- Export functionality to generate nicely formatted PDF documents
- Responsive design that works on mobile devices

## Covenant Sections

The tool covers typical small group topics including:
- Purpose & Mission
- Meeting Logistics (frequency, duration)
- Communication Guidelines
- Participation Guidelines
- Confidentiality
- Conflict Resolution
- Additional Commitments

## Technology Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Backend**: Node.js with Express
- **PDF Generation**: Puppeteer
- **Deployment**: Vercel/Netlify ready

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:3000`

## Deployment

### Vercel Deployment

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

### Netlify Deployment

1. Build command: `npm run build`
2. Publish directory: `public`
3. Add environment variables if needed

## Project Structure

```
community-covenant/
├── public/
│   ├── index.html          # Main application interface
│   ├── css/
│   │   └── styles.css      # Application styling
│   └── js/
│       └── app.js          # Frontend JavaScript
├── server/
│   └── server.js           # Express server and PDF generation
├── package.json            # Dependencies and scripts
├── vercel.json            # Vercel deployment configuration
└── README.md              # This file
```

## Usage

1. Enter your group name
2. Select or customize your purpose/mission
3. Choose meeting logistics (frequency, duration)
4. Set communication guidelines
5. Define participation expectations
6. Establish conflict resolution approach
7. Add any additional commitments
8. Preview your covenant in real-time
9. Export as PDF when ready

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this for your community groups!