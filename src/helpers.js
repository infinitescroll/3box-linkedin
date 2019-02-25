export const sendToLinkedIn = (popup = null) => {
  // Checks to save some memory if the popup exists as a window object
  if (popup === null || popup.closed) {
    popup = window.open(
      'https://www.linkedin.com/oauth/v2/authorization?client_id=77s9rt9wyixcwa&redirect_uri=http://localhost:3000/&response_type=code&scope=r_liteprofile'
    );
  } else popup.focus();
  return popup;
};

export const getData = (localProfile, box) => {
  const values = {};
  values.name = localProfile.name ? localProfile.name : box.name;
  values.image = localProfile.image[0] ? localProfile.image : box.image;
  values.school = localProfile.school ? localProfile.school : box.school;

  return values;
};

export const getURLParam = param => {
  const searchParam = new URLSearchParams(window.location.search);
  return searchParam.get(param);
};
