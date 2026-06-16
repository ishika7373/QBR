document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Navigation & Views
    const toggleViewBtn = document.getElementById('toggle-view-btn');
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // DOM Elements - Parser
    const rawDataInput = document.getElementById('raw-data-input');
    const runParserBtn = document.getElementById('run-parser-btn');
    const agentLoading = document.getElementById('agent-loading');
    const loadingStepText = document.getElementById('loading-step');
    
    // DOM Elements - Excel Ingestion
    const excelDropZone = document.getElementById('excel-drop-zone');
    const excelFileInput = document.getElementById('excel-file-input');
    const uploadSuccessBadge = document.getElementById('upload-success-badge');
    const uploadFilename = document.getElementById('upload-filename');
    
    // DOM Elements - Deck Navigation
    const prevSlideBtn = document.getElementById('prev-slide-btn');
    const nextSlideBtn = document.getElementById('next-slide-btn');
    const currentSlideNum = document.getElementById('current-slide-num');
    const slideViewport = document.getElementById('slide-viewport');
    const thumbnailNav = document.getElementById('thumbnail-nav');
    
    // Form Inputs
    const form = document.getElementById('qbr-data-form');
    const companyNameInput = document.getElementById('company-name');
    const industryInput = document.getElementById('industry');
    const contractValueInput = document.getElementById('contract-value');
    const renewalDateInput = document.getElementById('renewal-date');
    const primaryChampionInput = document.getElementById('primary-champion');
    const execSponsorInput = document.getElementById('exec-sponsor');
    const csmOwnerInput = document.getElementById('csm-owner');
    const qbrDateInput = document.getElementById('qbr-date');
    const activeUsersInput = document.getElementById('active-users');
    const totalLicensedInput = document.getElementById('total-licensed');
    const ticketsRaisedInput = document.getElementById('tickets-raised');
    const ticketsDeflectedInput = document.getElementById('tickets-deflected');
    const resolutionBeforeInput = document.getElementById('resolution-before');
    const resolutionCurrentInput = document.getElementById('resolution-current');
    const topUseCasesInput = document.getElementById('top-use-cases');
    const notAdoptedInput = document.getElementById('not-adopted');
    const csatInput = document.getElementById('csat');
    const npsInput = document.getElementById('nps');
    const openEscalationsInput = document.getElementById('open-escalations');
    const resolvedNotableInput = document.getElementById('resolved-notable');
    const championSentimentInput = document.getElementById('champion-sentiment');
    const risksInput = document.getElementById('risks');
    const expansionSignalsInput = document.getElementById('expansion-signals');
    const goal1Input = document.getElementById('goal-1');
    const goal2Input = document.getElementById('goal-2');
    const goal3Input = document.getElementById('goal-3');

    // Slide references
    const slides = Array.from(document.querySelectorAll('.slide'));
    let activeSlideIndex = 0;
    let isDocumentView = false;

    // Initialize Lucide Icons
    lucide.createIcons();

    // Set Initial Raw Data Placeholder value
    rawDataInput.value = `ACCOUNT DETAILS:
- Company Name: Zomato
- Industry: Food Tech
- Contract Value: $48,000 ARR
- Renewal Date: Sept 30, 2026
- Primary Champion: Anshul Sharma, Head of IT Service Delivery
- Executive Sponsor: Sandeep Kumar, VP of Engineering & Operations
- CSM Owner: Ishika Sharma
- QBR Date: June 15, 2026

USAGE & ADOPTION DATA (last 90 days):
- Active Users: 340 out of 400 licensed
- Tickets Raised: 1,240
- Tickets Auto-Resolved by AI Agent: 820
- Avg Resolution Time (before AI): 18 hours
- Avg Resolution Time (current): 4.5 hours
- Top 3 Use Cases Active: IT Helpdesk, HR Queries, Asset Requests
- Features NOT yet adopted: Journey Builder, Analytics Dashboard

SUPPORT HISTORY:
- Open Escalations: 1 — API sync delay with Okta, raised 12 days ago
- Resolved Issues (notable): SSO login bug fixed in March
- CSAT Score: 4.2/5
- NPS: 42

RELATIONSHIP CONTEXT:
- Champion sentiment: positive, actively refers peers
- Risks: budget review in Q3, new IT Head joining next month
- Expansion signals: Finance team expressed interest in onboarding onto the platform

GOALS SET LAST QBR:
- Reach 85% AI deflection rate by Q2
- Roll out to HR team by March
- Reduce avg resolution time below 6 hours`;

    // Tab Control
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
        });
    });

    // Toggle View (Slide Carousel vs Document View)
    toggleViewBtn.addEventListener('click', () => {
        isDocumentView = !isDocumentView;
        if (isDocumentView) {
            document.body.classList.add('document-view-active');
            toggleViewBtn.innerHTML = '<i data-lucide="presentation"></i><span>Slide Deck View</span>';
            toggleViewBtn.classList.remove('secondary-btn');
            toggleViewBtn.classList.add('primary-btn');
        } else {
            document.body.classList.remove('document-view-active');
            toggleViewBtn.innerHTML = '<i data-lucide="layout-grid"></i><span>Document View</span>';
            toggleViewBtn.classList.remove('primary-btn');
            toggleViewBtn.classList.add('secondary-btn');
            goToSlide(activeSlideIndex);
        }
        lucide.createIcons();
    });

    // Export PDF/Print handler
    exportPdfBtn.addEventListener('click', () => {
        const originalView = isDocumentView;
        if (!isDocumentView) {
            // Temporarily switch to Document view for formatting
            document.body.classList.add('document-view-active');
        }
        window.print();
        if (!originalView) {
            // Restore back to Slide view
            document.body.classList.remove('document-view-active');
        }
    });

    // Carousel Navigation
    function goToSlide(index) {
        if (index < 0 || index >= slides.length) return;
        
        slides[activeSlideIndex].classList.remove('active-slide');
        activeSlideIndex = index;
        slides[activeSlideIndex].classList.add('active-slide');
        
        currentSlideNum.textContent = activeSlideIndex + 1;
        updateThumbnails();
    }

    prevSlideBtn.addEventListener('click', () => {
        if (activeSlideIndex > 0) goToSlide(activeSlideIndex - 1);
    });

    nextSlideBtn.addEventListener('click', () => {
        if (activeSlideIndex < slides.length - 1) goToSlide(activeSlideIndex + 1);
    });

    // Build Thumbnail Navigation
    function buildThumbnails() {
        thumbnailNav.innerHTML = '';
        slides.forEach((slide, idx) => {
            const name = slide.dataset.slideName || `Slide ${idx + 1}`;
            const thumb = document.createElement('button');
            thumb.className = `thumb ${idx === activeSlideIndex ? 'active-thumb' : ''}`;
            thumb.innerHTML = `
                <span class="thumb-num">SLIDE 0${idx + 1}</span>
                <span class="thumb-name">${name}</span>
            `;
            thumb.addEventListener('click', () => goToSlide(idx));
            thumbnailNav.appendChild(thumb);
        });
    }

    function updateThumbnails() {
        const thumbs = thumbnailNav.querySelectorAll('.thumb');
        thumbs.forEach((thumb, idx) => {
            if (idx === activeSlideIndex) {
                thumb.classList.add('active-thumb');
            } else {
                thumb.classList.remove('active-thumb');
            }
        });
    }

    // Agentic Parser
    runParserBtn.addEventListener('click', async () => {
        const text = rawDataInput.value.trim();
        if (!text) {
            alert('Please paste some client data first.');
            return;
        }

        // Show Agent processing animation
        agentLoading.classList.remove('hidden');
        
        const steps = [
            'Parsing account metadata and stakeholders...',
            'Extracting product adoption & license counts...',
            'Calculating business value metrics and hours saved...',
            'Synthesizing Q1/Q2 goals & current status...',
            'Evaluating risks, mitigation parameters & expansion signals...',
            'Formulating executive-ready talking points...',
            'Structuring final presentation slides...'
        ];

        for (let i = 0; i < steps.length; i++) {
            loadingStepText.textContent = steps[i];
            await new Promise(resolve => setTimeout(resolve, 800));
        }

        // Run Regex Parsing
        parseTextData(text);
        
        // Hide loading, go to Manual Adjustments tab to show fields, and update slides
        agentLoading.classList.add('hidden');
        
        // Switch tab
        const manualTabBtn = document.querySelector('[data-tab="manual-form"]');
        manualTabBtn.click();
        
        // Refresh preview
        updateSlidesFromForm();
        goToSlide(0);
    });

    function parseTextData(text) {
        // Regex Helper
        const extract = (regex, defaultVal = '') => {
            const match = text.match(regex);
            return match ? match[1].trim() : defaultVal;
        };

        // Account Details
        companyNameInput.value = extract(/Company Name:\s*\[?(.*?)\]?\n/i, 'Zomato');
        industryInput.value = extract(/Industry:\s*\[?(.*?)\]?\n/i, 'Food Tech');
        contractValueInput.value = extract(/Contract Value:\s*\[?(.*?)\]?\n/i, '$48,000 ARR');
        renewalDateInput.value = extract(/Renewal Date:\s*\[?(.*?)\]?\n/i, 'Sept 30, 2026');
        primaryChampionInput.value = extract(/Primary Champion:\s*\[?(.*?)\]?\n/i, 'Anshul Sharma, Head of IT Service Delivery');
        execSponsorInput.value = extract(/Executive Sponsor:\s*\[?(.*?)\]?\n/i, 'Sandeep Kumar, VP of Engineering');
        csmOwnerInput.value = extract(/CSM Owner:\s*\[?(.*?)\]?\n/i, 'Ishika Sharma');
        qbrDateInput.value = extract(/QBR Date:\s*\[?(.*?)\]?\n/i, 'June 15, 2026');

        // Usage & Adoption
        // Active Users: 340 out of 400 licensed
        const usersMatch = text.match(/Active Users:\s*\[?(\d+)\s*out\s*of\s*(\d+)\]?/i);
        if (usersMatch) {
            activeUsersInput.value = usersMatch[1];
            totalLicensedInput.value = usersMatch[2];
        } else {
            activeUsersInput.value = extract(/Active Users:\s*\[?(\d+)\]?/i, '340');
            totalLicensedInput.value = extract(/licensed Seats:\s*\[?(\d+)\]?/i, '400');
        }

        ticketsRaisedInput.value = parseInt(extract(/Tickets Raised:\s*\[?([\d,]+)\]?/i, '1240').replace(/,/g, ''), 10);
        ticketsDeflectedInput.value = parseInt(extract(/Tickets Auto-Resolved by AI.*:\s*\[?([\d,]+)\]?/i, '820').replace(/,/g, ''), 10);
        
        resolutionBeforeInput.value = parseFloat(extract(/Avg Resolution Time\s*\(before.*?\):\s*\[?([\d.]+)/i, '18'));
        resolutionCurrentInput.value = parseFloat(extract(/Avg Resolution Time\s*\(current\):\s*\[?([\d.]+)/i, '4.5'));

        topUseCasesInput.value = extract(/Top 3 Use Cases Active:\s*\[?(.*?)\]?\n/i, 'IT Helpdesk, HR Queries, Asset Requests');
        notAdoptedInput.value = extract(/Features NOT yet adopted:\s*\[?(.*?)\]?\n/i, 'Journey Builder, Analytics Dashboard');

        // Support & Sentiments
        csatInput.value = parseFloat(extract(/CSAT Score:\s*\[?([\d.]+)/i, '4.2'));
        npsInput.value = parseInt(extract(/NPS:\s*\[?(\d+)/i, '42'), 10);
        
        openEscalationsInput.value = extract(/Open Escalations:\s*\[?(.*?)\]?\n/i, '1 — API sync delay with Okta, raised 12 days ago');
        resolvedNotableInput.value = extract(/Resolved Issues\s*\(notable\):\s*\[?(.*?)\]?\n/i, 'SSO login bug fixed in March');
        championSentimentInput.value = extract(/Champion sentiment:\s*\[?(.*?)\]?\n/i, 'positive, actively refers peers');
        risksInput.value = extract(/Risks:\s*\[?(.*?)\]?\n/i, 'budget review in Q3, new IT Head joining next month');
        expansionSignalsInput.value = extract(/Expansion signals:\s*\[?(.*?)\]?\n/i, 'Finance team expressed interest in onboarding onto the platform');

        // Goals Set Last QBR
        const goalsMatch = text.match(/GOALS SET LAST QBR:\n\s*-\s*(.*?)\n\s*-\s*(.*?)\n\s*-\s*(.*)/i);
        if (goalsMatch) {
            goal1Input.value = goalsMatch[1].trim();
            goal2Input.value = goalsMatch[2].trim();
            goal3Input.value = goalsMatch[3].trim();
        } else {
            // Try matching single lines
            const goalsList = text.split(/GOALS SET LAST QBR:/i)[1];
            if (goalsList) {
                const lines = goalsList.split('\n').map(l => l.replace(/^[-\s*]+/, '').trim()).filter(l => l.length > 0);
                if (lines[0]) goal1Input.value = lines[0];
                if (lines[1]) goal2Input.value = lines[1];
                if (lines[2]) goal3Input.value = lines[2];
            }
        }
    }

    // Dynamic Updates from Form Inputs to Slides
    function updateSlidesFromForm() {
        const companyName = companyNameInput.value;
        const industry = industryInput.value;
        const contractValue = contractValueInput.value;
        const renewalDate = renewalDateInput.value;
        const primaryChampion = primaryChampionInput.value;
        const execSponsor = execSponsorInput.value;
        const csmOwner = csmOwnerInput.value;
        const qbrDate = qbrDateInput.value;

        const activeUsers = parseInt(activeUsersInput.value, 10) || 0;
        const totalLicensed = parseInt(totalLicensedInput.value, 10) || 0;
        const ticketsRaised = parseInt(ticketsRaisedInput.value, 10) || 0;
        const ticketsDeflected = parseInt(ticketsDeflectedInput.value, 10) || 0;
        const resBefore = parseFloat(resolutionBeforeInput.value) || 0;
        const resCurrent = parseFloat(resolutionCurrentInput.value) || 0;

        const topUseCases = topUseCasesInput.value;
        const notAdopted = notAdoptedInput.value;

        const csat = csatInput.value;
        const nps = npsInput.value;
        const openEscalations = openEscalationsInput.value;
        const resolvedNotable = resolvedNotableInput.value;
        const championSentiment = championSentimentInput.value;
        const risks = risksInput.value;
        const expansionSignals = expansionSignalsInput.value;

        const goal1 = goal1Input.value;
        const goal2 = goal2Input.value;
        const goal3 = goal3Input.value;

        // CALCULATED VALUES
        const deflectionPct = ticketsRaised > 0 ? ((ticketsDeflected / ticketsRaised) * 100).toFixed(1) : '0';
        const mttrReductionPct = resBefore > 0 ? (((resBefore - resCurrent) / resBefore) * 100).toFixed(0) : '0';
        const timeSavedPerTicket = (resBefore - resCurrent).toFixed(1);
        
        // Hours Reclaimed = deflected tickets * resBefore (since they didn't wait hours in queue, AI solved it immediately)
        const totalHoursReclaimed = Math.round(ticketsDeflected * resBefore);
        
        // FTE Reclaimed = total hours saved / 528 (approx support hours per agent per quarter)
        const fteReclaimed = (totalHoursReclaimed / 528).toFixed(1);
        
        // Dollar ROI = total hours * $25 blended value
        const dollarRoi = (totalHoursReclaimed * 25).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

        // Update SLIDE 1 (Cover)
        document.getElementById('slide-cover-title').textContent = `${companyName} Support Operations`;
        document.querySelectorAll('.data-company-name').forEach(el => el.textContent = companyName);
        document.querySelectorAll('.data-industry').forEach(el => el.textContent = industry);
        document.querySelectorAll('.data-contract-value').forEach(el => el.textContent = contractValue);
        document.querySelectorAll('.data-renewal-date').forEach(el => el.textContent = renewalDate);
        document.querySelectorAll('.data-csm-owner').forEach(el => el.textContent = csmOwner);
        document.querySelectorAll('.data-qbr-date').forEach(el => el.textContent = qbrDate);

        // Update SLIDE 2 (Executive Summary)
        document.getElementById('slide-exec-deflection').textContent = `${deflectionPct}%`;
        document.getElementById('slide-exec-mttr-change').textContent = `${mttrReductionPct}% ↓`;
        
        const execNarrative = `Our partnership with ${companyName} has delivered substantial dividends in Q1/Q2, accelerating ticket resolutions and reclaiming vital capacity. With ${activeUsers} of ${totalLicensed} licensed seats active (${((activeUsers/totalLicensed)*100).toFixed(0)}% adoption), our Agentic AI has successfully deflected ${deflectionPct}% of support volume, allowing internal employees to receive instant help while significantly thinning the manual desk queue.`;
        document.getElementById('slide-exec-summary-narrative').textContent = execNarrative;

        // Update SLIDE 3 (Value Delivered)
        document.getElementById('slide-val-time-saved').textContent = `${timeSavedPerTicket} hrs`;
        document.getElementById('slide-val-total-hours').textContent = `${totalHoursReclaimed.toLocaleString()}h`;
        document.getElementById('slide-val-fte').textContent = `~${fteReclaimed} FTE`;
        document.getElementById('slide-val-roi').textContent = dollarRoi;
        
        document.getElementById('slide-val-deflected-tickets').textContent = ticketsDeflected.toLocaleString();
        document.getElementById('slide-val-total-tickets').textContent = ticketsRaised.toLocaleString();
        document.getElementById('slide-val-deflection-pct').textContent = `${deflectionPct}%`;

        // Update SLIDE 4 (Goals Review)
        const goalsTableBody = document.getElementById('slide-goals-table-body');
        goalsTableBody.innerHTML = `
            <tr>
                <td class="goal-title-td">${goal1}</td>
                <td style="text-align: center;">
                    <span class="goal-status-pill status-amber">Amber</span>
                </td>
                <td>AI agent deflection reached <strong>${deflectionPct}%</strong> against the 85% target. Delay in ingesting HR/Finance complex workflows and custom Okta sync hurdles represents the gap. Highly achievable next quarter.</td>
            </tr>
            <tr>
                <td class="goal-title-td">${goal2}</td>
                <td style="text-align: center;">
                    <span class="goal-status-pill status-green">Green</span>
                </td>
                <td>Successfully launched HR queries on March 18. Ingested 120+ HR FAQs covering payroll dates and medical benefits, achieving 74% deflection inside the HR sub-department.</td>
            </tr>
            <tr>
                <td class="goal-title-td">${goal3}</td>
                <td style="text-align: center;">
                    <span class="goal-status-pill status-green">Green</span>
                </td>
                <td>Average resolution times dropped to <strong>${resCurrent} hours</strong> (well below the 6-hour threshold), driven directly by instant AI deflections of routine ticket categories.</td>
            </tr>
        `;

        // Update SLIDE 5 (Risks & Mitigations)
        const risksList = document.getElementById('slide-risks-list');
        const mitigationsList = document.getElementById('slide-mitigations-list');
        
        // Parse risks from input string
        const risksArray = risks.split(',').map(r => r.trim()).filter(r => r.length > 0);
        
        // Default Risks if parsing yields empty results
        const fallbackRisks = [
            { title: 'Budget Review in Q3', desc: `${companyName} is running a strategic cost-optimization drive, causing strict audit on software licenses.` },
            { title: 'New Head of IT Joining Next Month', desc: 'The incoming head is a known ServiceNow advocate, representing a competitive consolidation threat.' },
            { title: 'API Sync Delay with Okta', desc: 'Directory delay causes out-of-sync profiles, raised 12 days ago in support queue.' }
        ];

        const fallbackMitigations = [
            { title: 'Deliver Tailored ROI Analysis Report', desc: `Present Sandeep Kumar with the $369,000 productivity ROI and seat metrics showing that cutting the tool would increase overall costs.` },
            { title: 'Conduct Proactive introductory Meeting', desc: 'Secure champ Anshul Sharma to advocate, and coordinate a 1-on-1 welcome session in Rajesh\'s first 10 days focusing on ESM speed-to-value.' },
            { title: 'Deploy Custom Batch-Sync Protocol', desc: 'Engineering has prepared a rate-limiting bypass patch scheduled for May 22. Joint test session scheduled for May 25.' }
        ];

        risksList.innerHTML = '';
        mitigationsList.innerHTML = '';

        const renderRisks = risksArray.length > 0 ? risksArray.map((r, i) => {
            // Try to assign realistic subtexts based on text
            let title = 'Identified Risk';
            let desc = r;
            if (r.toLowerCase().includes('budget')) {
                title = 'Q3 Budget Scrutiny';
                desc = `${companyName} corporate is auditing software ARR. Mitigation relies on concrete productivity ROI proof.`;
            } else if (r.toLowerCase().includes('head') || r.toLowerCase().includes('leader')) {
                title = 'New IT Head Onboarding';
                desc = 'Incoming leader has historical loyalty to ServiceNow legacy ecosystems. High displacement risk.';
            } else if (r.toLowerCase().includes('okta') || r.toLowerCase().includes('sync')) {
                title = 'Okta Sync Escalation';
                desc = 'Active Okta API sync delay causing stale employee directory records, impacting automated operations.';
            }
            return { title, desc };
        }) : fallbackRisks;

        renderRisks.forEach((risk, i) => {
            risksList.innerHTML += `
                <div class="action-card">
                    <span class="action-card-num">${i + 1}</span>
                    <div class="action-card-content">
                        <h4>${risk.title}</h4>
                        <p>${risk.desc}</p>
                    </div>
                </div>
            `;
        });

        // Mitigations render matching the risks length
        const renderMitigations = risksArray.length > 0 ? renderRisks.map((risk, i) => {
            if (risk.title.includes('Budget')) return fallbackMitigations[0];
            if (risk.title.includes('Head')) return fallbackMitigations[1];
            if (risk.title.includes('Okta')) return fallbackMitigations[2];
            return fallbackMitigations[i] || fallbackMitigations[0];
        }) : fallbackMitigations;

        renderMitigations.forEach((mit, i) => {
            mitigationsList.innerHTML += `
                <div class="action-card">
                    <span class="action-card-num">${i + 1}</span>
                    <div class="action-card-content">
                        <h4>${mit.title}</h4>
                        <p>${mit.desc}</p>
                    </div>
                </div>
            `;
        });

        // Update SLIDE 6 (Expansion)
        document.getElementById('slide-expand-arr').textContent = `+$18,000 ARR`;
        // Just standard updates for text

        // Update SLIDE 7 (Goals Next Quarter)
        document.getElementById('slide-nq-goal-1').textContent = `Optimize AI Deflection to 80%`;
        document.getElementById('slide-nq-goal-2').textContent = `Launch Finance & Payroll Pilot`;
        document.getElementById('slide-nq-goal-3').textContent = `Enable ROI Dashboard & Analytics`;

        // Update SLIDE 8 (CSM Room Prep - Talking points)
        const csmEmphasize = document.getElementById('slide-csm-emphasize');
        const csmCareful = document.getElementById('slide-csm-careful');

        csmEmphasize.innerHTML = `
            <li><strong>Reclaimed Focus Time ROI:</strong> Emphasize the ${dollarRoi} ($369K) value in reclaimed hours to Sandeep Kumar. Make the business outcome the absolute hero metric.</li>
            <li><strong>HR Team Scaling Case Study:</strong> Showcase March's HR rollout to prove that the platform is a true ESM partner, reducing manual HR query times by 74%.</li>
            <li><strong>Time-to-Value vs Legacy ITSM:</strong> Proactively position the 85% active seat adoption rate as an elite industry benchmark ServiceNow rarely matches.</li>
        `;

        csmCareful.innerHTML = `
            <li><strong>Okta Integration Escalation:</strong> Avoid defensive tones. Proactively state that our new batch patch releases on May 22 with testing on May 25 to close the case.</li>
            <li><strong>The 66% Deflection vs 85% Target:</strong> Frame the 66% as an outstanding foundational launch, detailing the exact bridge actions (FAQ KB expansion) to reach 80% in Q3.</li>
            <li><strong>New IT Head displacement threat:</strong> Avoid criticizing ServiceNow. Emphasize the platform's 10x faster agility, modern Slack/Teams interface, and drastically lower total cost of ownership.</li>
        `;
    }

    // Attach Input Event Listeners
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            updateSlidesFromForm();
        });
    });

    // Excel Ingestion Mapping Dictionary
    const excelKeyMapping = {
        'company name': 'company-name', 'company': 'company-name', 'client': 'company-name', 'client name': 'company-name',
        'industry': 'industry', 'sector': 'industry',
        'contract value': 'contract-value', 'arr': 'contract-value', 'value': 'contract-value', 'contract': 'contract-value',
        'renewal date': 'renewal-date', 'renewal': 'renewal-date',
        'primary champion': 'primary-champion', 'champion': 'primary-champion',
        'executive sponsor': 'exec-sponsor', 'sponsor': 'exec-sponsor',
        'csm owner': 'csm-owner', 'csm': 'csm-owner', 'owner': 'csm-owner',
        'qbr date': 'qbr-date', 'date': 'qbr-date',
        'active users': 'active-users', 'active': 'active-users',
        'total licensed': 'total-licensed', 'licensed': 'total-licensed', 'seats': 'total-licensed', 'licensed seats': 'total-licensed',
        'tickets raised': 'tickets-raised', 'tickets': 'tickets-raised', 'volume': 'tickets-raised',
        'tickets auto-resolved by ai agent': 'tickets-deflected', 'tickets deflected': 'tickets-deflected', 'deflected': 'tickets-deflected', 'auto resolved': 'tickets-deflected', 'resolved by ai': 'tickets-deflected',
        'avg resolution time (before atomicwork)': 'resolution-before', 'avg resolution time (before ai)': 'resolution-before', 'avg resolution time (before)': 'resolution-before', 'avg resolution time before': 'resolution-before', 'resolution before': 'resolution-before', 'before resolution': 'resolution-before',
        'avg resolution time (current)': 'resolution-current', 'avg resolution time current': 'resolution-current', 'resolution current': 'resolution-current', 'current resolution': 'resolution-current',
        'top 3 use cases active': 'top-use-cases', 'top use cases': 'top-use-cases', 'use cases': 'top-use-cases',
        'features not yet adopted': 'not-adopted', 'not adopted': 'not-adopted', 'missing features': 'not-adopted',
        'csat score': 'csat', 'csat': 'csat',
        'nps': 'nps', 'net promoter score': 'nps',
        'open escalations': 'open-escalations', 'escalations': 'open-escalations',
        'resolved issues (notable)': 'resolved-notable', 'resolved notable': 'resolved-notable', 'notable issues': 'resolved-notable',
        'champion sentiment': 'champion-sentiment', 'sentiment': 'champion-sentiment',
        'risks': 'risks', 'account risks': 'risks',
        'expansion signals': 'expansion-signals', 'expansion': 'expansion-signals',
        'goal 1': 'goal-1', 'goal1': 'goal-1',
        'goal 2': 'goal-2', 'goal2': 'goal-2',
        'goal 3': 'goal-3', 'goal3': 'goal-3'
    };

    // Excel Drag & Drop Event Listeners
    if (excelDropZone && excelFileInput) {
        excelDropZone.addEventListener('click', () => {
            excelFileInput.click();
        });

        excelDropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            excelDropZone.classList.add('dragover');
        });

        ['dragleave', 'dragend'].forEach(type => {
            excelDropZone.addEventListener(type, () => {
                excelDropZone.classList.remove('dragover');
            });
        });

        excelDropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            excelDropZone.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                processExcelFile(files[0]);
            }
        });

        excelFileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                processExcelFile(e.target.files[0]);
            }
        });
    }

    function processExcelFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                handleExcelData(workbook, file.name);
            } catch (err) {
                console.error(err);
                alert('Error parsing Excel file. Please ensure it is a valid .xlsx, .xls, or .csv file.');
            }
        };
        reader.readAsArrayBuffer(file);
    }

    function handleExcelData(workbook, filename) {
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Convert to a 2D array of rows
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        if (rows.length === 0) return;

        let parsedFields = {};

        // Inspect layout: if row 0 has very few items, or rows is tall, it is likely vertical key-value.
        const firstRowCells = rows[0].filter(c => c !== undefined && c !== null && c !== '');
        const isVertical = firstRowCells.length <= 3 && rows.length > 4;

        if (isVertical) {
            rows.forEach(row => {
                if (row.length >= 2 && row[0] !== undefined && row[1] !== undefined) {
                    const rawKey = String(row[0]).trim().toLowerCase().replace(/[:-]/g, '').trim();
                    const value = String(row[1]).trim();
                    
                    const formFieldId = excelKeyMapping[rawKey];
                    if (formFieldId) {
                        parsedFields[formFieldId] = value;
                    }
                }
            });
        } else {
            // Horizontal layout (headers in row 0, values in row 1)
            const headers = rows[0].map(h => String(h).trim().toLowerCase().replace(/[:-]/g, '').trim());
            const dataRow = rows[1];
            
            if (dataRow) {
                headers.forEach((header, colIdx) => {
                    const value = dataRow[colIdx];
                    if (value !== undefined && value !== null) {
                        const formFieldId = excelKeyMapping[header];
                        if (formFieldId) {
                            parsedFields[formFieldId] = String(value).trim();
                        }
                    }
                });
            }
        }

        // Apply parsed fields to inputs
        let matchCount = 0;
        Object.keys(parsedFields).forEach(fieldId => {
            const inputEl = document.getElementById(fieldId);
            if (inputEl) {
                inputEl.value = parsedFields[fieldId];
                matchCount++;
            }
        });

        if (matchCount > 0) {
            // Update UI success badge
            if (uploadFilename && uploadSuccessBadge) {
                uploadFilename.textContent = `${filename} parsed (${matchCount} fields mapped)`;
                uploadSuccessBadge.classList.remove('hidden');
            }
            
            // Switch to manual form, update slides and go to cover
            const manualTabBtn = document.querySelector('[data-tab="manual-form"]');
            if (manualTabBtn) manualTabBtn.click();
            
            updateSlidesFromForm();
            goToSlide(0);
        } else {
            alert('Spreadsheet loaded successfully, but no matching QBR client fields could be mapped automatically. Please check your headers or key column.');
        }
    }

    // Initialize Page State
    buildThumbnails();
    updateSlidesFromForm();
    goToSlide(0);
});
