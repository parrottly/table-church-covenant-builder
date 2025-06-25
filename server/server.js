const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

function generateCovenantHTML(data) {
    const title = data.groupName ? `${data.groupName} Community Covenant` : 'The Table Church Community Group Covenant';
    
    let sectionsHTML = '';
    
    if (data.season) {
        sectionsHTML += `
            <div class="section">
                <h3>Season & Timeline</h3>
                <p>${data.season}</p>
            </div>
        `;
    }

    if (data.mission) {
        sectionsHTML += `
            <div class="section">
                <h3>Our Shared Mission</h3>
                <p>${data.mission}</p>
            </div>
        `;
    }
    
    if (data.frequency || data.duration || data.meals) {
        sectionsHTML += `
            <div class="section">
                <h3>Meeting Logistics</h3>
        `;
        if (data.frequency) {
            sectionsHTML += `<p><strong>Frequency:</strong> ${data.frequency}</p>`;
        }
        if (data.duration) {
            sectionsHTML += `<p><strong>Duration:</strong> ${data.duration}</p>`;
        }
        if (data.meals) {
            sectionsHTML += `<p><strong>Meals & Hospitality:</strong> ${data.meals}</p>`;
        }
        sectionsHTML += '</div>';
    }
    
    if (data.inclusiveSpace) {
        sectionsHTML += `
            <div class="section">
                <h3>Safe & Inclusive Space Guidelines</h3>
                <p>${data.inclusiveSpace}</p>
            </div>
        `;
    }

    if (data.confidentiality) {
        sectionsHTML += `
            <div class="section">
                <h3>Confidentiality & Trust</h3>
                <p>${data.confidentiality}</p>
            </div>
        `;
    }
    
    if (data.participation) {
        sectionsHTML += `
            <div class="section">
                <h3>Participation & Shared Responsibility</h3>
                <p>${data.participation}</p>
            </div>
        `;
    }

    if (data.memberExpectations) {
        sectionsHTML += `
            <div class="section">
                <h3>What We Expect from Each Other</h3>
                <p>${data.memberExpectations}</p>
            </div>
        `;
    }

    if (data.leaderExpectations) {
        sectionsHTML += `
            <div class="section">
                <h3>What We Expect from Our Leaders</h3>
                <p>${data.leaderExpectations}</p>
            </div>
        `;
    }
    
    if (data.conflict) {
        sectionsHTML += `
            <div class="section">
                <h3>Navigating Conflict & Disagreement</h3>
                <p>${data.conflict}</p>
            </div>
        `;
    }

    if (data.dietary) {
        sectionsHTML += `
            <div class="section">
                <h3>Dietary Needs & Accessibility</h3>
                <p>${data.dietary}</p>
            </div>
        `;
    }
    
    if (data.additional) {
        sectionsHTML += `
            <div class="section">
                <h3>Additional Commitments</h3>
                <p>${data.additional}</p>
            </div>
        `;
    }
    
    sectionsHTML += `
        <div class="section agreement">
            <h3>Our Commitment</h3>
            <p><em>By participating in this group, we agree to uphold these commitments and embody The Table Church's values as we create authentic belonging together.</em></p>
            <div class="values">
                <div><strong>Radical</strong> Friendship</div>
                <div><strong>Relentless</strong> Curiosity</div>
                <div><strong>Rooted</strong> Improvisation</div>
                <div><strong>Restorative</strong> Play</div>
                <div><strong>Revolutionary</strong> Justice</div>
            </div>
            <div class="signature-section">
                <p><strong>Date:</strong> _________________</p>
                <br>
                <p><strong>Group Members:</strong></p>
                <div class="signature-lines">
                    <p>Name: _________________________ Signature: _________________________</p>
                    <p>Name: _________________________ Signature: _________________________</p>
                    <p>Name: _________________________ Signature: _________________________</p>
                    <p>Name: _________________________ Signature: _________________________</p>
                    <p>Name: _________________________ Signature: _________________________</p>
                </div>
            </div>
        </div>
        <div class="non-discrimination">
            <strong>The Table Church Non-Discrimination Statement:</strong> The Table Church believes that no aspect of someone's identity should limit their ability to fully participate in the life of the Church. Membership, Employment, Eligibility for Eldership and Officership, other Church Leadership Roles, and Religious Rites must not be denied on the basis of one's identity, including race, color, sex, sexual orientation, gender identity or expression, age, disability, marital status, citizenship, national origin, veteran status, or genetic information.
        </div>
    `;

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <style>
                :root {
                    --table-purple: #6969b8;
                    --table-mint: #7cc5a8;
                    --table-dark-gray: #4d4d4d;
                }
                
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 40px 20px;
                    background: white;
                }
                
                .header {
                    text-align: center;
                    margin-bottom: 40px;
                }
                
                .logo-text {
                    color: var(--table-purple);
                    font-size: 1.4rem;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                
                h1 {
                    color: var(--table-purple);
                    text-align: center;
                    font-size: 2.0rem;
                    margin-bottom: 20px;
                    border-bottom: 3px solid var(--table-mint);
                    padding-bottom: 20px;
                }
                
                .mission {
                    background: linear-gradient(135deg, var(--table-mint), var(--table-purple));
                    color: white;
                    padding: 15px;
                    border-radius: 8px;
                    margin: 20px 0;
                    text-align: center;
                    font-style: italic;
                }
                
                .section {
                    margin-bottom: 35px;
                    page-break-inside: avoid;
                }
                
                .section h3 {
                    color: var(--table-purple);
                    font-size: 1.3rem;
                    margin-bottom: 15px;
                    border-bottom: 1px solid var(--table-mint);
                    padding-bottom: 8px;
                }
                
                .section p {
                    margin-bottom: 12px;
                    line-height: 1.7;
                }
                
                .values {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    margin: 20px 0;
                    font-size: 0.9rem;
                }
                
                .values div {
                    color: var(--table-dark-gray);
                }
                
                .values strong {
                    color: var(--table-purple);
                }
                
                .agreement {
                    margin-top: 50px;
                    padding-top: 30px;
                    border-top: 2px solid var(--table-mint);
                }
                
                .signature-section {
                    margin-top: 40px;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 8px;
                }
                
                .signature-lines p {
                    margin: 15px 0;
                    border-bottom: 1px solid #ccc;
                    padding-bottom: 10px;
                }
                
                .non-discrimination {
                    background: #f9fafa;
                    padding: 15px;
                    border-left: 4px solid var(--table-mint);
                    margin: 30px 0;
                    font-size: 0.9rem;
                    color: var(--table-dark-gray);
                }
                
                @media print {
                    body {
                        padding: 20px;
                    }
                    
                    .section {
                        page-break-inside: avoid;
                    }
                    
                    .agreement {
                        page-break-before: auto;
                    }
                    
                    .values {
                        flex-direction: column;
                        gap: 5px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="logo-text">THE TABLE CHURCH</div>
                <h1>${title}</h1>
                <div class="mission">
                    <strong>Our Mission:</strong> Cultivating communities of authentic belonging following in the prophetic, thoughtful, and radical way of Jesus.
                </div>
            </div>
            ${sectionsHTML}
        </body>
        </html>
    `;
}

app.post('/api/generate-pdf', async (req, res) => {
    try {
        const covenantData = req.body;
        
        if (!Object.values(covenantData).some(value => value)) {
            return res.status(400).json({ error: 'No data provided' });
        }

        const html = generateCovenantHTML(covenantData);
        
        const browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ]
        });
        
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        
        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '1in',
                bottom: '1in',
                left: '0.75in',
                right: '0.75in'
            }
        });
        
        await browser.close();
        
        const filename = `${covenantData.groupName || 'Community'}_Covenant.pdf`;
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.send(pdf);
        
    } catch (error) {
        console.error('PDF generation error:', error);
        console.error('Error details:', error.message);
        res.status(500).json({ 
            error: 'Failed to generate PDF',
            details: error.message 
        });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
    console.log(`Community Covenant Builder server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to use the application`);
});