const item = {
  certificate: 'certificates',
  lead: 'lead',
};

const req = async (url, data) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  }).then((response) => {
    return response.json();
  });
  return response;
};

export const createCertificateOrder = async (data) => {
  const url = `/api/createorder`;
  data.item = item.certificate;
  return req(url, data);
};

export const createLead = async (data) => {
  const url = `/api/createorder`;
  data.item = item.lead;
  return req(url, data);
};
