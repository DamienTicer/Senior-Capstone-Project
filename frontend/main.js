import { fetchSchoolProfile } from './api.js';

async function loadProfile() {
  const profileData = await fetchSchoolProfile();

  if (profileData) {
    document.getElementById('school-name').textContent = profileData.schoolName;
    document.getElementById('school-logo').src = profileData.logoUrl;

    const technologyList = document.getElementById('technology-list');
    profileData.technologyOnSale.forEach((item) => {
      const techItem = document.createElement('div');
      techItem.className = 'technology-item';
      techItem.innerHTML = `
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <p><strong>Price:</strong> ${item.price}</p>
      `;
      technologyList.appendChild(techItem);
    });
  } else {
    console.error("Failed to load profile data.");
  }
}

// Load profile on page load
loadProfile();
