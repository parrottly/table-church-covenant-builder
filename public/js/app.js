document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('covenant-form');
    const previewContent = document.getElementById('preview-content');
    const previewTitle = document.getElementById('preview-title');
    const exportButton = document.getElementById('export-pdf');

    function handleCustomFields() {
        // Handle traditional select dropdowns (only the ones still using dropdowns)
        const selectors = [
            { select: '#season', custom: '#season-custom' },
            { select: '#frequency', custom: '#frequency-custom' },
            { select: '#duration', custom: '#duration-custom' }
        ];

        selectors.forEach(({ select, custom }) => {
            const selectElement = document.querySelector(select);
            const customElement = document.querySelector(custom);

            if (selectElement && customElement) {
                selectElement.addEventListener('change', function() {
                    if (this.value === 'custom') {
                        customElement.style.display = 'block';
                        customElement.focus();
                    } else {
                        customElement.style.display = 'none';
                        customElement.value = '';
                    }
                    updatePreview();
                });

                customElement.addEventListener('input', updatePreview);
            }
        });

        // Handle checkbox groups with custom options
        const checkboxCustomFields = [
            { checkId: '#mission-custom-check', customId: '#mission-custom' },
            { checkId: '#format-custom-check', customId: '#format-custom' },
            { checkId: '#meals-custom-check', customId: '#meals-custom' },
            { checkId: '#process-norms-custom-check', customId: '#process-norms-custom' },
            { checkId: '#communication-norms-custom-check', customId: '#communication-norms-custom' },
            { checkId: '#virtual-norms-custom-check', customId: '#virtual-norms-custom' },
            { checkId: '#inclusive-space-custom-check', customId: '#inclusive-space-custom' },
            { checkId: '#confidentiality-custom-check', customId: '#confidentiality-custom' },
            { checkId: '#participation-custom-check', customId: '#participation-custom' },
            { checkId: '#member-expectations-custom-check', customId: '#member-expectations-custom' },
            { checkId: '#leader-expectations-custom-check', customId: '#leader-expectations-custom' },
            { checkId: '#conflict-custom-check', customId: '#conflict-custom' }
        ];

        checkboxCustomFields.forEach(({ checkId, customId }) => {
            const checkElement = document.querySelector(checkId);
            const customElement = document.querySelector(customId);

            if (checkElement && customElement) {
                checkElement.addEventListener('change', function() {
                    if (this.checked) {
                        customElement.style.display = 'block';
                        customElement.focus();
                    } else {
                        customElement.style.display = 'none';
                        customElement.value = '';
                    }
                    updatePreview();
                });

                customElement.addEventListener('input', updatePreview);
            }
        });

        // Add event listeners to all checkboxes
        const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
        allCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updatePreview);
        });
    }

    function getFieldValue(selectId, customId) {
        const select = document.getElementById(selectId);
        const custom = document.getElementById(customId);
        
        if (select && select.value === 'custom' && custom) {
            return custom.value.trim();
        }
        return select ? select.value : '';
    }

    function getTextValue(fieldId) {
        const field = document.getElementById(fieldId);
        return field ? field.value.trim() : '';
    }

    function getCheckboxValues(name, customFieldId) {
        const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
        const values = [];
        
        checkboxes.forEach(checkbox => {
            if (checkbox.value === 'custom') {
                const customField = document.getElementById(customFieldId);
                if (customField && customField.value.trim()) {
                    values.push(customField.value.trim());
                }
            } else {
                values.push(checkbox.value);
            }
        });
        
        return values;
    }

    function formatCheckboxList(values) {
        if (values.length === 0) return '';
        if (values.length === 1) return values[0];
        
        return '<ul>' + values.map(value => `<li>${value}</li>`).join('') + '</ul>';
    }

    function updatePreview() {
        const groupName = getTextValue('group-name');
        const season = getFieldValue('season', 'season-custom');
        
        let html = '';

        if (groupName) {
            previewTitle.textContent = `${groupName} Community Covenant`;
        } else {
            previewTitle.textContent = 'The Table Church Community Group Covenant';
        }

        if (season) {
            html += `<div class="preview-section-title">Season & Timeline</div>`;
            html += `<p>${season}</p>`;
        }

        const missionValues = getCheckboxValues('mission', 'mission-custom');
        if (missionValues.length > 0) {
            html += `<div class="preview-section-title">Our Shared Mission</div>`;
            html += formatCheckboxList(missionValues);
        }

        const frequency = getFieldValue('frequency', 'frequency-custom');
        const duration = getFieldValue('duration', 'duration-custom');
        const formatValues = getCheckboxValues('format', 'format-custom');
        const mealsValues = getCheckboxValues('meals', 'meals-custom');
        
        if (frequency || duration || formatValues.length > 0 || mealsValues.length > 0) {
            html += `<div class="preview-section-title">Meeting Logistics</div>`;
            if (frequency) {
                html += `<p><strong>Frequency:</strong> ${frequency}</p>`;
            }
            if (duration) {
                html += `<p><strong>Duration:</strong> ${duration}</p>`;
            }
            if (formatValues.length > 0) {
                html += `<p><strong>Meeting Format:</strong></p>`;
                html += formatCheckboxList(formatValues);
            }
            if (mealsValues.length > 0) {
                html += `<p><strong>Meals & Hospitality:</strong></p>`;
                html += formatCheckboxList(mealsValues);
            }
        }

        const processNorms = getCheckboxValues('processNorms', 'process-norms-custom');
        const communicationNorms = getCheckboxValues('communicationNorms', 'communication-norms-custom');
        const virtualNorms = getCheckboxValues('virtualNorms', 'virtual-norms-custom');
        
        if (processNorms.length > 0 || communicationNorms.length > 0 || virtualNorms.length > 0) {
            html += `<div class="preview-section-title">Meeting Norms & Guidelines</div>`;
            if (processNorms.length > 0) {
                html += `<p><strong>Process Norms:</strong></p>`;
                html += formatCheckboxList(processNorms);
            }
            if (communicationNorms.length > 0) {
                html += `<p><strong>Communication Norms:</strong></p>`;
                html += formatCheckboxList(communicationNorms);
            }
            if (virtualNorms.length > 0) {
                html += `<p><strong>Virtual Meeting Norms:</strong></p>`;
                html += formatCheckboxList(virtualNorms);
            }
        }

        const inclusiveSpaceValues = getCheckboxValues('inclusiveSpace', 'inclusive-space-custom');
        if (inclusiveSpaceValues.length > 0) {
            html += `<div class="preview-section-title">Safe & Inclusive Space Guidelines</div>`;
            html += formatCheckboxList(inclusiveSpaceValues);
        }

        const confidentialityValues = getCheckboxValues('confidentiality', 'confidentiality-custom');
        if (confidentialityValues.length > 0) {
            html += `<div class="preview-section-title">Confidentiality & Trust</div>`;
            html += formatCheckboxList(confidentialityValues);
        }

        const participationValues = getCheckboxValues('participation', 'participation-custom');
        if (participationValues.length > 0) {
            html += `<div class="preview-section-title">Participation & Shared Responsibility</div>`;
            html += formatCheckboxList(participationValues);
        }

        const memberExpectationsValues = getCheckboxValues('memberExpectations', 'member-expectations-custom');
        if (memberExpectationsValues.length > 0) {
            html += `<div class="preview-section-title">What We Expect from Each Other</div>`;
            html += formatCheckboxList(memberExpectationsValues);
        }

        const leaderExpectationsValues = getCheckboxValues('leaderExpectations', 'leader-expectations-custom');
        if (leaderExpectationsValues.length > 0) {
            html += `<div class="preview-section-title">What We Expect from Our Leaders</div>`;
            html += formatCheckboxList(leaderExpectationsValues);
        }

        const conflictValues = getCheckboxValues('conflict', 'conflict-custom');
        if (conflictValues.length > 0) {
            html += `<div class="preview-section-title">Navigating Conflict & Disagreement</div>`;
            html += formatCheckboxList(conflictValues);
        }

        const dietary = getTextValue('dietary');
        if (dietary) {
            html += `<div class="preview-section-title">Dietary Needs & Accessibility</div>`;
            html += `<p>${dietary}</p>`;
        }

        const additional = getTextValue('additional');
        if (additional) {
            html += `<div class="preview-section-title">Additional Commitments</div>`;
            html += `<p>${additional}</p>`;
        }

        if (html === '') {
            html = '<p><em>Complete the form to see your covenant preview here...</em></p>';
        } else {
            html += `<div class="preview-section-title">Our Commitment</div>`;
            html += `<p><em>By participating in this group, we agree to uphold these commitments and embody The Table Church's values of radical friendship, relentless curiosity, rooted improvisation, restorative play, and revolutionary justice as we create authentic belonging together.</em></p>`;
        }

        previewContent.innerHTML = html;
    }

    function exportToPDF() {
        const covenantData = {
            groupName: getTextValue('group-name'),
            season: getFieldValue('season', 'season-custom'),
            mission: getCheckboxValues('mission', 'mission-custom'),
            frequency: getFieldValue('frequency', 'frequency-custom'),
            duration: getFieldValue('duration', 'duration-custom'),
            format: getCheckboxValues('format', 'format-custom'),
            meals: getCheckboxValues('meals', 'meals-custom'),
            processNorms: getCheckboxValues('processNorms', 'process-norms-custom'),
            communicationNorms: getCheckboxValues('communicationNorms', 'communication-norms-custom'),
            virtualNorms: getCheckboxValues('virtualNorms', 'virtual-norms-custom'),
            inclusiveSpace: getCheckboxValues('inclusiveSpace', 'inclusive-space-custom'),
            confidentiality: getCheckboxValues('confidentiality', 'confidentiality-custom'),
            participation: getCheckboxValues('participation', 'participation-custom'),
            memberExpectations: getCheckboxValues('memberExpectations', 'member-expectations-custom'),
            leaderExpectations: getCheckboxValues('leaderExpectations', 'leader-expectations-custom'),
            conflict: getCheckboxValues('conflict', 'conflict-custom'),
            dietary: getTextValue('dietary'),
            additional: getTextValue('additional')
        };

        // Check if any field has content (handle both strings and arrays)
        const hasContent = Object.values(covenantData).some(value => {
            if (Array.isArray(value)) {
                return value.length > 0;
            }
            return value && value.trim();
        });

        if (!hasContent) {
            alert('Please fill out at least one section before exporting.');
            return;
        }

        exportButton.disabled = true;
        exportButton.textContent = 'Generating PDF...';

        // Try server-side PDF first, fallback to client-side
        fetch('/api/generate-pdf', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(covenantData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Server PDF generation failed');
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `${covenantData.groupName || 'Community'}_Covenant.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        })
        .catch(error => {
            console.error('Server PDF failed, trying client-side:', error);
            generateClientPDF(covenantData);
        })
        .finally(() => {
            exportButton.disabled = false;
            exportButton.textContent = 'Export as PDF';
        });
    }

    function generateClientPDF(covenantData) {
        // Fallback: Generate PDF using print dialog
        const printWindow = window.open('', '_blank');
        const title = covenantData.groupName ? `${covenantData.groupName} Community Covenant` : 'The Table Church Community Group Covenant';
        
        let content = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${title}</title>
                <style>
                    :root {
                        --table-purple: #6969b8;
                        --table-mint: #7cc5a8;
                        --table-dark-gray: #4d4d4d;
                    }
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
                    .header { text-align: center; margin-bottom: 40px; }
                    .logo-text { color: var(--table-purple); font-size: 1.4rem; font-weight: bold; margin-bottom: 10px; }
                    h1 { color: var(--table-purple); text-align: center; border-bottom: 3px solid var(--table-mint); padding-bottom: 20px; font-size: 1.8rem; }
                    .mission { background: linear-gradient(135deg, var(--table-mint), var(--table-purple)); color: white; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; font-style: italic; }
                    .section { margin: 25px 0; page-break-inside: avoid; }
                    .section h3 { color: var(--table-purple); border-bottom: 1px solid var(--table-mint); padding-bottom: 8px; font-size: 1.2rem; }
                    .values { display: flex; flex-wrap: wrap; gap: 15px; margin: 20px 0; font-size: 0.9rem; }
                    .values div { color: var(--table-dark-gray); }
                    .values strong { color: var(--table-purple); }
                    .signature-section { margin-top: 40px; padding: 20px; background: #f8f9fa; border-radius: 8px; }
                    .signature-lines p { margin: 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
                    .non-discrimination { background: #f9fafa; padding: 15px; border-left: 4px solid var(--table-mint); margin: 30px 0; font-size: 0.9rem; color: var(--table-dark-gray); }
                    @media print { body { margin: 20px; } .values { flex-direction: column; } }
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
        `;

        if (covenantData.season) {
            content += `<div class="section"><h3>Season & Timeline</h3><p>${covenantData.season}</p></div>`;
        }

        function formatArrayForPDF(arr) {
            if (!arr || arr.length === 0) return '';
            if (arr.length === 1) return arr[0];
            return '<ul>' + arr.map(item => `<li>${item}</li>`).join('') + '</ul>';
        }

        if (covenantData.mission && covenantData.mission.length > 0) {
            content += `<div class="section"><h3>Our Shared Mission</h3>${formatArrayForPDF(covenantData.mission)}</div>`;
        }
        
        if (covenantData.frequency || covenantData.duration || (covenantData.format && covenantData.format.length > 0) || (covenantData.meals && covenantData.meals.length > 0)) {
            content += `<div class="section"><h3>Meeting Logistics</h3>`;
            if (covenantData.frequency) content += `<p><strong>Frequency:</strong> ${covenantData.frequency}</p>`;
            if (covenantData.duration) content += `<p><strong>Duration:</strong> ${covenantData.duration}</p>`;
            if (covenantData.format && covenantData.format.length > 0) {
                content += `<p><strong>Meeting Format:</strong></p>${formatArrayForPDF(covenantData.format)}`;
            }
            if (covenantData.meals && covenantData.meals.length > 0) {
                content += `<p><strong>Meals & Hospitality:</strong></p>${formatArrayForPDF(covenantData.meals)}`;
            }
            content += `</div>`;
        }

        if ((covenantData.processNorms && covenantData.processNorms.length > 0) || 
            (covenantData.communicationNorms && covenantData.communicationNorms.length > 0) || 
            (covenantData.virtualNorms && covenantData.virtualNorms.length > 0)) {
            content += `<div class="section"><h3>Meeting Norms & Guidelines</h3>`;
            if (covenantData.processNorms && covenantData.processNorms.length > 0) {
                content += `<p><strong>Process Norms:</strong></p>${formatArrayForPDF(covenantData.processNorms)}`;
            }
            if (covenantData.communicationNorms && covenantData.communicationNorms.length > 0) {
                content += `<p><strong>Communication Norms:</strong></p>${formatArrayForPDF(covenantData.communicationNorms)}`;
            }
            if (covenantData.virtualNorms && covenantData.virtualNorms.length > 0) {
                content += `<p><strong>Virtual Meeting Norms:</strong></p>${formatArrayForPDF(covenantData.virtualNorms)}`;
            }
            content += `</div>`;
        }
        
        if (covenantData.inclusiveSpace && covenantData.inclusiveSpace.length > 0) {
            content += `<div class="section"><h3>Safe & Inclusive Space Guidelines</h3>${formatArrayForPDF(covenantData.inclusiveSpace)}</div>`;
        }

        if (covenantData.confidentiality && covenantData.confidentiality.length > 0) {
            content += `<div class="section"><h3>Confidentiality & Trust</h3>${formatArrayForPDF(covenantData.confidentiality)}</div>`;
        }
        
        if (covenantData.participation && covenantData.participation.length > 0) {
            content += `<div class="section"><h3>Participation & Shared Responsibility</h3>${formatArrayForPDF(covenantData.participation)}</div>`;
        }

        if (covenantData.memberExpectations && covenantData.memberExpectations.length > 0) {
            content += `<div class="section"><h3>What We Expect from Each Other</h3>${formatArrayForPDF(covenantData.memberExpectations)}</div>`;
        }

        if (covenantData.leaderExpectations && covenantData.leaderExpectations.length > 0) {
            content += `<div class="section"><h3>What We Expect from Our Leaders</h3>${formatArrayForPDF(covenantData.leaderExpectations)}</div>`;
        }
        
        if (covenantData.conflict && covenantData.conflict.length > 0) {
            content += `<div class="section"><h3>Navigating Conflict & Disagreement</h3>${formatArrayForPDF(covenantData.conflict)}</div>`;
        }

        if (covenantData.dietary) {
            content += `<div class="section"><h3>Dietary Needs & Accessibility</h3><p>${covenantData.dietary}</p></div>`;
        }
        
        if (covenantData.additional) {
            content += `<div class="section"><h3>Additional Commitments</h3><p>${covenantData.additional}</p></div>`;
        }
        
        content += `
            <div class="section">
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
                    <p><strong>Date:</strong> _________________</p><br>
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
            <script>window.print(); window.close();</script>
            </body>
            </html>
        `;
        
        printWindow.document.write(content);
        printWindow.document.close();
    }

    form.addEventListener('input', updatePreview);
    form.addEventListener('change', updatePreview);
    exportButton.addEventListener('click', exportToPDF);

    handleCustomFields();
    updatePreview();
});