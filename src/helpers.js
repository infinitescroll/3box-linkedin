export const sendToLinkedIn = () => {
  // could easily fully integrate this html returned form this link into the page
  window.location.replace(
    'https://www.linkedin.com/oauth/v2/authorization?client_id=77s9rt9wyixcwa&redirect_uri=http://localhost:3000/&response_type=code&scope=r_liteprofile'
  );
};

export const getData = (localProfile, box) => {
  const values = {};
  values.name = localProfile.name ? localProfile.name : box.name;
  values.image = localProfile.image[0] ? localProfile.image : box.image;
  values.school = localProfile.school ? localProfile.school : box.school;

  return values;
};
