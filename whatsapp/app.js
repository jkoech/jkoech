let selectedGroups = [];
let uploadedImageUrl = "";
let csvData = [];
let editingTemplateId = null;

// Load templates on pa ge load
document.addEventListener("DOMContentLoaded", function () {
  loadTemplates();
});

function loadTemplates() {
  const templates = JSON.parse(localStorage.getItem("templates") || "[]");
  const container = document.getElementById("templatesContainer");

  if (templates.length === 0) {
    container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">📋</div>
                        <div class="empty-text">No templates yet</div>
                        <div class="empty-subtext">Create your first template to get started</div>
                    </div>
                `;
  } else {
    const templatesGrid = document.createElement("div");
    templatesGrid.className = "templates-grid";

    templates.forEach((template, index) => {
      const card = document.createElement("div");
      card.className = "template-card";
      card.innerHTML = `
                        <div class="template-card-header">
                            <div class="template-name">${
                              template.name || "Untitled Template"
                            }</div>
                            <div class="template-date">${new Date(
                              template.timestamp
                            ).toLocaleDateString()}</div>
                        </div>
                        <div class="template-preview-text">${
                          template.content || "No content"
                        }</div>
                        <div class="template-actions">
                            <button class="template-btn template-btn-edit" onclick="editTemplate(${index})">Edit</button>
                            <button class="template-btn template-btn-delete" onclick="deleteTemplate(${index})">Delete</button>
                        </div>
                    `;
      templatesGrid.appendChild(card);
    });

    container.innerHTML = "";
    container.appendChild(templatesGrid);
  }
}

function editTemplate(index) {
  const templates = JSON.parse(localStorage.getItem("templates") || "[]");
  const template = templates[index];

  editingTemplateId = index;

  // Populate form with template data
  document.getElementById("templateName").value = template.name || "";
  document.getElementById("templateContent").value = template.content || "";

  if (template.image) {
    uploadedImageUrl = template.image;
    const preview = document.getElementById("uploadedImage");
    preview.src = uploadedImageUrl;
    preview.style.display = "block";
  }

  // Set selected groups
  selectedGroups = template.groups || [];
  document.querySelectorAll(".group-chip").forEach((chip) => {
    const groupName = chip.getAttribute("onclick").match(/'([^']+)'/)[1];
    if (selectedGroups.includes(groupName)) {
      chip.classList.add("selected");
    } else {
      chip.classList.remove("selected");
    }
  });

  csvData = template.csvData || [];

  updatePreview();
  openModal();
}

function deleteTemplate(index) {
  if (confirm("Are you sure you want to delete this template?")) {
    const templates = JSON.parse(localStorage.getItem("templates") || "[]");
    templates.splice(index, 1);
    localStorage.setItem("templates", JSON.stringify(templates));
    loadTemplates();
  }
}

function openModal() {
  document.getElementById("modalOverlay").style.display = "block";
}

function closeModal() {
  document.getElementById("modalOverlay").style.display = "none";
  // Reset form
  editingTemplateId = null;
  document.getElementById("templateName").value = "";
  document.getElementById("templateContent").value = "";
  document.getElementById("uploadedImage").style.display = "none";
  uploadedImageUrl = "";
  selectedGroups = [];
  csvData = [];
  document
    .querySelectorAll(".group-chip")
    .forEach((chip) => chip.classList.remove("selected"));
  updatePreview();
}

function switchTab(tabName) {
  // Remove active class from all tabs and contents
  document
    .querySelectorAll(".tab")
    .forEach((tab) => tab.classList.remove("active"));
  document
    .querySelectorAll(".tab-content")
    .forEach((content) => content.classList.remove("active"));

  // Add active class to clicked tab and corresponding content
  event.target.classList.add("active");
  document.getElementById(tabName + "Tab").classList.add("active");
}

function toggleGroup(element, groupName) {
  element.classList.toggle("selected");

  if (selectedGroups.includes(groupName)) {
    selectedGroups = selectedGroups.filter((g) => g !== groupName);
  } else {
    selectedGroups.push(groupName);
  }

  updatePreview();
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      uploadedImageUrl = e.target.result;
      const preview = document.getElementById("uploadedImage");
      preview.src = uploadedImageUrl;
      preview.style.display = "block";
      updatePreview();
    };
    reader.readAsDataURL(file);
  }
}

function handleDrop(event) {
  event.preventDefault();
  event.target.classList.remove("dragover");

  const files = event.dataTransfer.files;
  if (files.length > 0 && files[0].type.startsWith("image/")) {
    document.getElementById("imageUpload").files = files;
    handleImageUpload({ target: { files: files } });
  }
}

function handleDragOver(event) {
  event.preventDefault();
  event.target.classList.add("dragover");
}

function handleDragLeave(event) {
  event.target.classList.remove("dragover");
}

function handleCSVUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const csv = e.target.result;
      csvData = parseCSV(csv);
      updatePreview();
    };
    reader.readAsText(file);
  }
}

function parseCSV(csv) {
  const lines = csv.split("\n");
  const headers = lines[0].split(",").map((h) => h.trim());
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = lines[i].split(",").map((v) => v.trim());
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });
      data.push(row);
    }
  }

  return data;
}

function updatePreview() {
  const content = document.getElementById("templateContent").value;
  const preview = document.getElementById("templatePreview");

  if (!content && !uploadedImageUrl) {
    preview.innerHTML =
      '<div class="whatsapp-message"><div>Your template preview will appear here as you type...</div><div class="message-time">12:34 <span class="message-status">✓✓</span></div></div>';
    return;
  }

  let messageContent = "";

  if (uploadedImageUrl) {
    messageContent += `<img src="${uploadedImageUrl}" alt="Template Image">`;
  }

  if (content) {
    // Replace variables with sample data for preview
    let previewContent = content
      .replace(/\{\{firstName\}\}/g, '<span class="variable-tag">John</span>')
      .replace(/\{\{lastName\}\}/g, '<span class="variable-tag">Doe</span>')
      .replace(
        /\{\{email\}\}/g,
        '<span class="variable-tag">john.doe@company.com</span>'
      )
      .replace(
        /\{\{company\}\}/g,
        '<span class="variable-tag">Acme Corp</span>'
      )
      .replace(
        /\{\{position\}\}/g,
        '<span class="variable-tag">Manager</span>'
      );

    messageContent += `<div>${previewContent.replace(/\n/g, "<br>")}</div>`;
  }

  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  messageContent += `<div class="message-time">${currentTime} <span class="message-status">✓✓</span></div>`;

  preview.innerHTML = `<div class="whatsapp-message">${messageContent}</div>`;

  // Add target info if available
  if (selectedGroups.length > 0 || csvData.length > 0) {
    let targetInfo = "";
    if (selectedGroups.length > 0) {
      targetInfo += `<strong>Target Groups:</strong> ${selectedGroups.join(
        ", "
      )}<br>`;
    }
    if (csvData.length > 0) {
      targetInfo += `<strong>CSV Data:</strong> ${csvData.length} users loaded`;
    }

    preview.innerHTML += `<div style="background: rgba(255,255,255,0.9); margin: 20px; padding: 15px; border-radius: 10px; color: #333; font-size: 12px;">
                    ${targetInfo}
                </div>`;
  }
}

function saveTemplate() {
  const templateData = {
    name: document.getElementById("templateName").value,
    content: document.getElementById("templateContent").value,
    image: uploadedImageUrl,
    groups: selectedGroups,
    csvData: csvData,
    timestamp: new Date().toISOString(),
  };

  // In the PHP version, this will make an API call
  console.log("Saving template:", templateData);

  const templates = JSON.parse(localStorage.getItem("templates") || "[]");

  if (editingTemplateId !== null) {
    // Update existing template
    templates[editingTemplateId] = templateData;
    alert("Template updated successfully!");
  } else {
    // Add new template
    templates.push(templateData);
    alert("Template saved successfully!");
  }

  localStorage.setItem("templates", JSON.stringify(templates));
  closeModal();
  loadTemplates();
}

function testTemplate() {
  const templateName =
    document.getElementById("templateName").value || "Untitled Template";

  if (!document.getElementById("templateContent").value) {
    alert("Please add some content to test the template.");
    return;
  }

  alert(
    `Test message sent for template: "${templateName}"\n\nThis would send a test message to your number in a real implementation.`
  );
}

function sendBroadcast() {
  const templateName =
    document.getElementById("templateName").value || "Untitled Template";
  const content = document.getElementById("templateContent").value;

  if (!content) {
    alert("Please add some content before sending broadcast.");
    return;
  }

  if (selectedGroups.length === 0 && csvData.length === 0) {
    alert("Please select target groups or upload a CSV file with recipients.");
    return;
  }

  let recipientCount = 0;
  if (csvData.length > 0) {
    recipientCount = csvData.length;
  } else {
    // Estimate based on groups (this would be actual counts in PHP version)
    recipientCount = selectedGroups.length * 10; // Mock count
  }

  if (
    confirm(
      `Are you sure you want to send "${templateName}" to ${recipientCount} recipients?`
    )
  ) {
    alert(
      `Broadcast queued successfully!\n\nTemplate: "${templateName}"\nRecipients: ${recipientCount}\n\nMessages will be sent shortly.`
    );
    closeModal();
  }
}

// Update preview when content changes
document
  .getElementById("templateContent")
  .addEventListener("input", updatePreview);
document
  .getElementById("templateName")
  .addEventListener("input", updatePreview);

// Close modal when clicking outside
document.getElementById("modalOverlay").addEventListener("click", function (e) {
  if (e.target === this) {
    closeModal();
  }
});
