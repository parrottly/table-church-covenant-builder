const puppeteer = require('puppeteer');

function generateCovenantHTML(data) {
    const title = data.groupName ? `${data.groupName} Community Covenant` : 'The Table Church Community Group Covenant';
    
    let sectionsHTML = '';
    
    function formatArray(arr) {
        if (!arr || arr.length === 0) return '';
        if (arr.length === 1) return arr[0];
        return '<ul>' + arr.map(item => `<li>${item}</li>`).join('') + '</ul>';
    }
    
    if (data.season) {
        sectionsHTML += `
            <div class="section">
                <h3>Season & Timeline</h3>
                <p>${data.season}</p>
            </div>
        `;
    }

    if (data.mission && data.mission.length > 0) {
        sectionsHTML += `
            <div class="section">
                <h3>Our Shared Mission</h3>
                ${formatArray(data.mission)}
            </div>
        `;
    }
    
    if (data.frequency || data.duration || (data.format && data.format.length > 0) || (data.meals && data.meals.length > 0)) {
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
        if (data.format && data.format.length > 0) {
            sectionsHTML += `<p><strong>Meeting Format:</strong></p>${formatArray(data.format)}`;
        }
        if (data.meals && data.meals.length > 0) {
            sectionsHTML += `<p><strong>Meals & Hospitality:</strong></p>${formatArray(data.meals)}`;
        }
        sectionsHTML += '</div>';
    }

    if ((data.processNorms && data.processNorms.length > 0) || 
        (data.communicationNorms && data.communicationNorms.length > 0) || 
        (data.virtualNorms && data.virtualNorms.length > 0)) {
        sectionsHTML += `
            <div class="section">
                <h3>Meeting Norms & Guidelines</h3>
        `;
        if (data.processNorms && data.processNorms.length > 0) {
            sectionsHTML += `<p><strong>Process Norms:</strong></p>${formatArray(data.processNorms)}`;
        }
        if (data.communicationNorms && data.communicationNorms.length > 0) {
            sectionsHTML += `<p><strong>Communication Norms:</strong></p>${formatArray(data.communicationNorms)}`;
        }
        if (data.virtualNorms && data.virtualNorms.length > 0) {
            sectionsHTML += `<p><strong>Virtual Meeting Norms:</strong></p>${formatArray(data.virtualNorms)}`;
        }
        sectionsHTML += '</div>';
    }
    
    if (data.inclusiveSpace && data.inclusiveSpace.length > 0) {
        sectionsHTML += `
            <div class="section">
                <h3>Safe & Inclusive Space Guidelines</h3>
                ${formatArray(data.inclusiveSpace)}
            </div>
        `;
    }

    if (data.confidentiality && data.confidentiality.length > 0) {
        sectionsHTML += `
            <div class="section">
                <h3>Confidentiality & Trust</h3>
                ${formatArray(data.confidentiality)}
            </div>
        `;
    }
    
    if (data.participation && data.participation.length > 0) {
        sectionsHTML += `
            <div class="section">
                <h3>Participation & Shared Responsibility</h3>
                ${formatArray(data.participation)}
            </div>
        `;
    }

    if (data.memberExpectations && data.memberExpectations.length > 0) {
        sectionsHTML += `
            <div class="section">
                <h3>What We Expect from Each Other</h3>
                ${formatArray(data.memberExpectations)}
            </div>
        `;
    }

    if (data.leaderExpectations && data.leaderExpectations.length > 0) {
        sectionsHTML += `
            <div class="section">
                <h3>What We Expect from Our Leaders</h3>
                ${formatArray(data.leaderExpectations)}
            </div>
        `;
    }
    
    if (data.conflict && data.conflict.length > 0) {
        sectionsHTML += `
            <div class="section">
                <h3>Navigating Conflict & Disagreement</h3>
                ${formatArray(data.conflict)}
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
                
                .section ul {
                    margin: 15px 0;
                    padding-left: 20px;
                }
                
                .section li {
                    margin: 8px 0;
                    line-height: 1.6;
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

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const covenantData = JSON.parse(event.body);
        
        // Check if any field has content (handle both strings and arrays)
        const hasContent = Object.values(covenantData).some(value => {
            if (Array.isArray(value)) {
                return value.length > 0;
            }
            return value && value.trim();
        });

        if (!hasContent) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'No data provided' })
            };
        }

        const html = generateCovenantHTML(covenantData);
        
        // For Netlify, we'll use a simpler approach since Puppeteer can be tricky in serverless
        // Return the HTML for client-side PDF generation instead
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'text/html',
                'Content-Disposition': `attachment; filename="${covenantData.groupName || 'Community'}_Covenant.html"`
            },
            body: html
        };
        
    } catch (error) {
        console.error('PDF generation error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Failed to generate PDF',
                details: error.message 
            })
        };
    }
};