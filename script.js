document.getElementById("schemeForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const data = {
        student_type: document.getElementById("student_type").value,
        year: parseInt(document.getElementById("year").value),
        category: document.getElementById("category").value,
        income: parseInt(document.getElementById("income").value),
        state: document.getElementById("state").value
    };

    // Show loading state
    document.getElementById("result").innerHTML = `
        <div class="result-header text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-2">Searching for scholarships...</p>
        </div>
    `;

    fetch("/api/check", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(result => {
        let output = "";

        if (result.length === 0) {
            output = `
                <div class="no-schemes">
                    <i class="fas fa-inbox"></i>
                    <h5>No Scholarships Found</h5>
                    <p>We couldn't find any schemes matching your criteria. Try adjusting your filters.</p>
                </div>
            `;
        } else {
            output = `
                <div class="result-header">
                    <h4><i class="fas fa-check-circle"></i> Found ${result.length} Scholarship${result.length > 1 ? 's' : ''} For You!</h4>
                </div>
            `;
            
            result.forEach((scheme, index) => {
                output += `
                    <div class="scheme-card" style="animation-delay: ${index * 0.1}s">
                        <h5><i class="fas fa-award"></i> ${scheme.name}</h5>
                        <div class="scheme-info">
                            <div class="scheme-info-item">
                                <i class="fas fa-gift"></i>
                                <strong>Benefits:</strong>
                                <span>${scheme.benefits}</span>
                            </div>
                            <div class="scheme-info-item">
                                <i class="fas fa-calendar-check"></i>
                                <strong>Deadline:</strong>
                                <span>${scheme.deadline}</span>
                            </div>
                            <div class="scheme-info-item">
                                <i class="fas fa-map-marked-alt"></i>
                                <strong>State:</strong>
                                <span>${scheme.state}</span>
                            </div>
                        </div>
                        <button class="btn btn-view-details" onclick='viewScheme(${JSON.stringify(scheme).replace(/'/g, "&apos;")})'>
                            View Full Details <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                `;
            });
        }

        document.getElementById("result").innerHTML = output;
        
        // Smooth scroll to results
        document.getElementById("result").scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    })
    .catch(error => {
        document.getElementById("result").innerHTML = `
            <div class="no-schemes">
                <i class="fas fa-exclamation-triangle"></i>
                <h5>Error</h5>
                <p>Unable to fetch scholarships. Please make sure the backend server is running.</p>
            </div>
        `;
    });
});

function viewScheme(scheme) {
    localStorage.setItem("selectedScheme", JSON.stringify(scheme));
    window.location.href = "scheme.html";
}

