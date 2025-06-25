document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('covenant-form');
    const previewContent = document.getElementById('preview-content');
    const previewTitle = document.getElementById('preview-title');
    const exportButton = document.getElementById('export-pdf');
    const themeToggle = document.getElementById('theme-toggle');
    const mobilePreviewToggle = document.getElementById('mobile-preview-toggle');
    const mobileIndicator = document.getElementById('mobile-indicator');
    const previewSection = document.querySelector('.preview-section');
    
    // Theme Management
    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            setTheme(savedTheme);
        } else if (systemPrefersDark) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
    
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
        
        // Update logo for theme
        const logo = document.querySelector('.logo');
        if (logo) {
            logo.src = theme === 'dark' ? 'table-text-white-transparent.png' : 'table-text-black-transparent.png';
        }
        
        // Update aria-label
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
        }
    }
    
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    }
    
    // Initialize theme on page load
    initializeTheme();
    
    // Theme toggle event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Mobile Preview Management
    let previewOpen = false;
    
    function toggleMobilePreview() {
        previewOpen = !previewOpen;
        if (previewSection) {
            previewSection.classList.toggle('open', previewOpen);
        }
        if (mobileIndicator) {
            mobileIndicator.classList.toggle('hidden', previewOpen);
        }
    }
    
    function closeMobilePreview() {
        previewOpen = false;
        if (previewSection) {
            previewSection.classList.remove('open');
        }
        if (mobileIndicator) {
            mobileIndicator.classList.remove('hidden');
        }
    }
    
    // Mobile preview event listeners
    if (mobilePreviewToggle) {
        mobilePreviewToggle.addEventListener('click', toggleMobilePreview);
    }
    
    if (mobileIndicator) {
        mobileIndicator.addEventListener('click', toggleMobilePreview);
    }
    
    // Close preview when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && previewOpen && 
            !previewSection.contains(e.target) && 
            !mobileIndicator.contains(e.target)) {
            closeMobilePreview();
        }
    });
    
    // Auto-hide mobile indicator when scrolling on mobile
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (window.innerWidth <= 768 && !previewOpen) {
            if (mobileIndicator) {
                mobileIndicator.style.opacity = '0.5';
            }
            
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                if (mobileIndicator) {
                    mobileIndicator.style.opacity = '1';
                }
            }, 1000);
        }
    });

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
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
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
            additional: getTextValue('additional'),
            theme: currentTheme
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

        // Try advanced PDF generation first, fallback to print dialog
        try {
            generateAdvancedPDF(covenantData);
        } catch (error) {
            console.log('Advanced PDF generation failed, using print dialog:', error);
            generateClientPDF(covenantData);
        }
        
        // Reset button state after a short delay
        setTimeout(() => {
            exportButton.disabled = false;
            exportButton.textContent = 'Export as PDF';
        }, 2000);
    }

    async function generateAdvancedPDF(covenantData) {
        // Check if html2canvas and jsPDF are available
        if (typeof html2canvas === 'undefined' || typeof window.jsPDF === 'undefined') {
            throw new Error('PDF libraries not available');
        }

        const { jsPDF } = window.jsPDF;
        
        // Create a temporary element with the covenant content
        const tempElement = document.createElement('div');
        tempElement.style.cssText = `
            position: absolute;
            left: -9999px;
            top: 0;
            width: 800px;
            background: white;
            padding: 40px;
            font-family: 'Raleway', sans-serif;
            line-height: 1.6;
            color: #333;
        `;
        
        const title = covenantData.groupName ? `${covenantData.groupName} Community Covenant` : 'The Table Church Community Group Covenant';
        
        // Generate the same content as the print version but optimized for PDF
        let content = `
            <div style="text-align: center; margin-bottom: 40px;">
                <div style="color: #6969b8; font-size: 1.4rem; font-weight: bold; font-family: 'Barlow', sans-serif; margin-bottom: 10px;">THE TABLE CHURCH</div>
                <h1 style="color: #6969b8; font-size: 1.8rem; font-family: 'Rubik Mono One', monospace; font-weight: 400; letter-spacing: -0.02em; border-bottom: 3px solid #7cc5a8; padding-bottom: 20px; margin: 20px 0;">${title}</h1>
                <div style="background: linear-gradient(135deg, #7cc5a8, #6969b8); color: white; padding: 15px; border-radius: 8px; margin: 20px 0; font-family: 'Barlow', sans-serif; font-weight: 500;">
                    <strong>Our Mission:</strong> Cultivating communities of authentic belonging following in the prophetic, thoughtful, and radical way of Jesus.
                </div>
            </div>
        `;
        
        // Add all the sections (reusing the same logic from generateClientPDF)
        function formatArrayForPDF(arr) {
            if (!arr || arr.length === 0) return '';
            if (arr.length === 1) return `<p>${arr[0]}</p>`;
            return '<ul style="margin: 10px 0; padding-left: 20px;">' + arr.map(item => `<li style="margin: 5px 0;">${item}</li>`).join('') + '</ul>';
        }

        if (covenantData.season) {
            content += `<div style="margin: 25px 0;"><h3 style="color: #6969b8; font-family: 'Barlow', sans-serif; font-weight: 600; border-bottom: 1px solid #7cc5a8; padding-bottom: 8px; font-size: 1.2rem;">Season & Timeline</h3><p>${covenantData.season}</p></div>`;
        }

        if (covenantData.mission && covenantData.mission.length > 0) {
            content += `<div style="margin: 25px 0;"><h3 style="color: #6969b8; font-family: 'Barlow', sans-serif; font-weight: 600; border-bottom: 1px solid #7cc5a8; padding-bottom: 8px; font-size: 1.2rem;">Our Shared Mission</h3>${formatArrayForPDF(covenantData.mission)}</div>`;
        }
        
        if (covenantData.frequency || covenantData.duration || (covenantData.format && covenantData.format.length > 0) || (covenantData.meals && covenantData.meals.length > 0)) {
            content += `<div style="margin: 25px 0;"><h3 style="color: #6969b8; font-family: 'Barlow', sans-serif; font-weight: 600; border-bottom: 1px solid #7cc5a8; padding-bottom: 8px; font-size: 1.2rem;">Meeting Logistics</h3>`;
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

        // Add other sections...
        if ((covenantData.processNorms && covenantData.processNorms.length > 0) || 
            (covenantData.communicationNorms && covenantData.communicationNorms.length > 0) || 
            (covenantData.virtualNorms && covenantData.virtualNorms.length > 0)) {
            content += `<div style="margin: 25px 0;"><h3 style="color: #6969b8; font-family: 'Barlow', sans-serif; font-weight: 600; border-bottom: 1px solid #7cc5a8; padding-bottom: 8px; font-size: 1.2rem;">Meeting Norms & Guidelines</h3>`;
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
        
        // Continue with remaining sections...
        const sections = [
            {key: 'inclusiveSpace', title: 'Safe & Inclusive Space Guidelines'},
            {key: 'confidentiality', title: 'Confidentiality & Trust'},
            {key: 'participation', title: 'Participation & Shared Responsibility'},
            {key: 'memberExpectations', title: 'What We Expect from Each Other'},
            {key: 'leaderExpectations', title: 'What We Expect from Our Leaders'},
            {key: 'conflict', title: 'Navigating Conflict & Disagreement'}
        ];
        
        sections.forEach(section => {
            if (covenantData[section.key] && covenantData[section.key].length > 0) {
                content += `<div style="margin: 25px 0;"><h3 style="color: #6969b8; font-family: 'Barlow', sans-serif; font-weight: 600; border-bottom: 1px solid #7cc5a8; padding-bottom: 8px; font-size: 1.2rem;">${section.title}</h3>${formatArrayForPDF(covenantData[section.key])}</div>`;
            }
        });

        if (covenantData.dietary) {
            content += `<div style="margin: 25px 0;"><h3 style="color: #6969b8; font-family: 'Barlow', sans-serif; font-weight: 600; border-bottom: 1px solid #7cc5a8; padding-bottom: 8px; font-size: 1.2rem;">Dietary Needs & Accessibility</h3><p>${covenantData.dietary}</p></div>`;
        }
        
        if (covenantData.additional) {
            content += `<div style="margin: 25px 0;"><h3 style="color: #6969b8; font-family: 'Barlow', sans-serif; font-weight: 600; border-bottom: 1px solid #7cc5a8; padding-bottom: 8px; font-size: 1.2rem;">Additional Commitments</h3><p>${covenantData.additional}</p></div>`;
        }
        
        // Add commitment section
        content += `
            <div style="margin: 50px 0 30px 0; padding-top: 30px; border-top: 2px solid #7cc5a8;">
                <h3 style="color: #6969b8; font-family: 'Barlow', sans-serif; font-weight: 600; font-size: 1.2rem; margin-bottom: 15px;">Our Commitment</h3>
                <p style="margin-bottom: 20px;"><em>By participating in this group, we agree to uphold these commitments and embody The Table Church's values as we create authentic belonging together.</em></p>
                <div style="display: flex; flex-wrap: wrap; gap: 15px; margin: 20px 0; font-size: 0.9rem;">
                    <div><strong style="color: #6969b8;">Radical</strong> Friendship</div>
                    <div><strong style="color: #6969b8;">Relentless</strong> Curiosity</div>
                    <div><strong style="color: #6969b8;">Rooted</strong> Improvisation</div>
                    <div><strong style="color: #6969b8;">Restorative</strong> Play</div>
                    <div><strong style="color: #6969b8;">Revolutionary</strong> Justice</div>
                </div>
                <div style="margin-top: 40px; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                    <p><strong>Date:</strong> _________________</p><br>
                    <p><strong>Group Members:</strong></p>
                    <div style="margin-top: 15px;">
                        <p style="margin: 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 10px;">Name: _________________________ Signature: _________________________</p>
                        <p style="margin: 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 10px;">Name: _________________________ Signature: _________________________</p>
                        <p style="margin: 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 10px;">Name: _________________________ Signature: _________________________</p>
                        <p style="margin: 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 10px;">Name: _________________________ Signature: _________________________</p>
                        <p style="margin: 15px 0; border-bottom: 1px solid #ccc; padding-bottom: 10px;">Name: _________________________ Signature: _________________________</p>
                    </div>
                </div>
            </div>
            <div style="background: #f9fafa; padding: 15px; border-left: 4px solid #7cc5a8; margin: 30px 0; font-size: 0.9rem; color: #4d4d4d;">
                <strong>The Table Church Non-Discrimination Statement:</strong> The Table Church believes that no aspect of someone's identity should limit their ability to fully participate in the life of the Church. Membership, Employment, Eligibility for Eldership and Officership, other Church Leadership Roles, and Religious Rites must not be denied on the basis of one's identity, including race, color, sex, sexual orientation, gender identity or expression, age, disability, marital status, citizenship, national origin, veteran status, or genetic information.
            </div>
        `;
        
        tempElement.innerHTML = content;
        document.body.appendChild(tempElement);
        
        try {
            // Use html2canvas to convert to image
            const canvas = await html2canvas(tempElement, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff'
            });
            
            // Create PDF
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            
            const ratio = Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight);
            const imgWidth = canvasWidth * ratio;
            const imgHeight = canvasHeight * ratio;
            
            const marginX = (pdfWidth - imgWidth) / 2;
            const marginY = (pdfHeight - imgHeight) / 2;
            
            pdf.addImage(imgData, 'PNG', marginX, marginY, imgWidth, imgHeight);
            
            // Download the PDF
            const filename = covenantData.groupName ? 
                `${covenantData.groupName.replace(/[^a-z0-9]/gi, '_')}_Community_Covenant.pdf` : 
                'Community_Covenant.pdf';
            
            pdf.save(filename);
            
        } finally {
            // Clean up
            document.body.removeChild(tempElement);
        }
    }

    function generateClientPDF(covenantData) {
        // Fallback: Generate PDF using print dialog
        const printWindow = window.open('', '_blank');
        const title = covenantData.groupName ? `${covenantData.groupName} Community Covenant` : 'The Table Church Community Group Covenant';
        const isDark = covenantData.theme === 'dark';
        
        // Theme-aware colors
        const colors = {
            bg: isDark ? '#1f2937' : '#ffffff',
            text: isDark ? '#f9fafb' : '#333333',
            textSecondary: isDark ? '#e5e7eb' : '#4d4d4d',
            accent: '#6969b8',
            accentSecondary: '#7cc5a8',
            sectionBg: isDark ? '#374151' : '#f8f9fa',
            border: isDark ? '#4b5563' : '#cccccc'
        };
        
        let content = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${title}</title>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Rubik+Mono+One&family=Raleway:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Barlow:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">
                <style>
                    body { 
                        font-family: 'Raleway', 'Avenir', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; 
                        margin: 40px; 
                        line-height: 1.6; 
                        color: ${colors.text}; 
                        background-color: ${colors.bg};
                    }
                    .header { text-align: center; margin-bottom: 40px; }
                    .logo-text { color: ${colors.accent}; font-size: 1.4rem; font-weight: bold; margin-bottom: 10px; font-family: 'Barlow', sans-serif; }
                    h1 { color: ${colors.accent}; text-align: center; border-bottom: 3px solid ${colors.accentSecondary}; padding-bottom: 20px; font-size: 1.8rem; font-family: 'Rubik Mono One', monospace; font-weight: 400; letter-spacing: -0.02em; }
                    .mission { background: linear-gradient(135deg, ${colors.accentSecondary}, ${colors.accent}); color: white; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; font-family: 'Barlow', sans-serif; font-weight: 500; }
                    .section { margin: 25px 0; page-break-inside: avoid; }
                    .section h3 { color: ${colors.accent}; border-bottom: 1px solid ${colors.accentSecondary}; padding-bottom: 8px; font-size: 1.2rem; font-family: 'Barlow', sans-serif; font-weight: 600; }
                    .values { display: flex; flex-wrap: wrap; gap: 15px; margin: 20px 0; font-size: 0.9rem; }
                    .values div { color: ${colors.textSecondary}; }
                    .values strong { color: ${colors.accent}; }
                    .signature-section { margin-top: 40px; padding: 20px; background: ${colors.sectionBg}; border-radius: 8px; }
                    .signature-lines p { margin: 15px 0; border-bottom: 1px solid ${colors.border}; padding-bottom: 10px; }
                    .non-discrimination { background: ${colors.sectionBg}; padding: 15px; border-left: 4px solid ${colors.accentSecondary}; margin: 30px 0; font-size: 0.9rem; color: ${colors.textSecondary}; }
                    @media print { body { margin: 20px; background-color: white !important; color: black !important; } .values { flex-direction: column; } }
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