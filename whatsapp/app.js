const headerType = document.getElementById('headerType');
const headerText = document.getElementById('headerText');
const headerImage = document.getElementById('headerImage');
const bodyText = document.getElementById('bodyText');
const footerText = document.getElementById('footerText');
const buttons = document.getElementById('buttons');
const preview = document.getElementById('previewArea');

const placeholderValues = {
  name: "John Doe",
  date: "2025-06-03"
};

function updatePreview() {
  preview.innerHTML = '';

  // Header
  if (headerType.value === 'text') {
    const h = document.createElement('h3');
    h.textContent = headerText.value;
    preview.appendChild(h);
  } else if (headerImage.files.length > 0) {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(headerImage.files[0]);
    preview.appendChild(img);
  }

  // Body
  const body = document.createElement('p');
  let text = bodyText.value;
  Object.keys(placeholderValues).forEach(k => {
    text = text.replace(new RegExp(`{{${k}}}`, 'g'), placeholderValues[k]);
  });
  body.textContent = text;
  body.className = 'body';
  preview.appendChild(body);

  // Footer
  if (footerText.value.trim()) {
    const footer = document.createElement('small');
    footer.textContent = footerText.value;
    footer.className = 'footer';
    preview.appendChild(footer);
  }

  // Buttons
  const btnContainer = document.createElement('div');
  btnContainer.className = 'buttons';
  buttons.value.split(',').forEach(label => {
    const btn = document.createElement('button');
    btn.textContent = label.trim();
    btn.type = 'button';
    btnContainer.appendChild(btn);
  });
  preview.appendChild(btnContainer);
}

// Add listeners
[headerType, headerText, headerImage, bodyText, footerText, buttons].forEach(input => {
  input.addEventListener('input', updatePreview);
});
headerImage.addEventListener('change', updatePreview);

// Initial render
updatePreview();
