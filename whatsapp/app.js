let selectedAudiences = [];
let selectedDate = "";
let selectedTime = "";

function openModal() {
  document.getElementById("modalOverlay").style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modalOverlay").style.display = "none";
  document.body.style.overflow = "auto";
}

function openDialog(dialogId) {
  document.getElementById(dialogId).style.display = "block";
}

function closeDialog(dialogId) {
  document.getElementById(dialogId).style.display = "none";
}

function updatePreview() {
  const title =
    document.getElementById("titleInput").value || "Your Title Here";
  const message =
    document.getElementById("messageInput").value ||
    "Your message will appear here...";

  document.getElementById("previewTitle").textContent = title;
  document.getElementById("previewBody").textContent = message;
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const previewImage = document.getElementById("previewImage");
      previewImage.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
    };
    reader.readAsDataURL(file);
  }
}

function toggleSchedule() {
  const toggle = document.getElementById("scheduleToggle");
  const buttons = document.getElementById("scheduleButtons");

  toggle.classList.toggle("active");
  buttons.classList.toggle("active");
}

function toggleAudience(audience) {
  const pill = document.querySelector(`[data-audience="${audience}"]`);
  if (selectedAudiences.includes(audience)) {
    selectedAudiences = selectedAudiences.filter((a) => a !== audience);
    pill.classList.remove("active");
  } else {
    selectedAudiences.push(audience);
    pill.classList.add("active");
  }
}

function configureVariables() {
  openDialog("variableDialog");
}

function insertVariable(variable) {
  const messageInput = document.getElementById("messageInput");
  const currentMessage = messageInput.value;
  const cursorPosition = messageInput.selectionStart;

  const newMessage =
    currentMessage.slice(0, cursorPosition) +
    variable +
    currentMessage.slice(cursorPosition);
  messageInput.value = newMessage;

  // Update cursor position
  messageInput.setSelectionRange(
    cursorPosition + variable.length,
    cursorPosition + variable.length
  );
  messageInput.focus();

  updatePreview();
}

function addCustomVariable() {
  const input = document.getElementById("customVariableInput");
  const variableName = input.value.trim();

  if (variableName) {
    const variable = `{{${variableName}}}`;
    const variableList = document.querySelector(".variable-list");
    const newTag = document.createElement("div");
    newTag.className = "variable-tag";
    newTag.textContent = variable;
    newTag.onclick = () => insertVariable(variable);
    variableList.appendChild(newTag);

    input.value = "";
  }
}

function configureCTA() {
  openDialog("ctaDialog");
}

function saveCTA() {
  const text =
    document.getElementById("ctaTextInput").value || "Call to Action";
  const type = document.getElementById("ctaTypeSelect").value;
  const value = document.getElementById("ctaValueInput").value;

  document.getElementById("previewCTA").textContent = text;
  closeDialog("ctaDialog");
}

function selectDate() {
  openDialog("dateDialog");
}

function saveDate() {
  const date = document.getElementById("dateInput").value;
  if (date) {
    selectedDate = date;
    const dateBtn = document.querySelector(
      '.schedule-btn[onclick="selectDate()"]'
    );
    dateBtn.textContent = `📅 ${date}`;
    closeDialog("dateDialog");
  }
}

function selectTime() {
  openDialog("timeDialog");
}

function saveTime() {
  const time = document.getElementById("timeInput").value;
  if (time) {
    selectedTime = time;
    const timeBtn = document.querySelector(
      '.schedule-btn[onclick="selectTime()"]'
    );
    timeBtn.textContent = `🕐 ${time}`;
    closeDialog("timeDialog");
  }
}

function handleCSVUpload(event) {
  const file = event.target.files[0];
  if (file) {
    // Here you would typically parse the CSV file
    // For now, we'll just show a success message
    const fileName = file.name;
    const label = document.querySelector('label[for="csvInput"]');
    label.textContent = `📊 ${fileName}`;
    label.style.background = "#e7f3ff";
    label.style.color = "#1877f2";
  }
}

// Close modal when clicking outside
document.getElementById("modalOverlay").addEventListener("click", function (e) {
  if (e.target === this) {
    closeModal();
  }
});

// Prevent modal from closing when clicking inside
document.querySelector(".modal").addEventListener("click", function (e) {
  e.stopPropagation();
});
