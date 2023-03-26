const item = {
  certificate: 'certificates',
  lead: 'lead',
  lead_pick_tour: 'lead_pick_tour',
  lead_order_tour: 'lead_order_tour',
  lead_request_call: 'lead_request_call',
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

export const createLeadPickTour = async (data) => {
  const url = `/api/createorder`;
  data.item = item.lead_pick_tour;
  return req(url, data);
};

export const createLeadOrderTour = async (data) => {
  const url = `/api/createorder`;
  data.item = item.lead_order_tour;
  return req(url, data);
};

export const createLeadRequestCall = async (data) => {
  const url = `/api/createorder`;
  data.item = item.lead_request_call;
  return req(url, data);
};

export const countryUpdateMinOffer = async () => {
  const url = `/api/getMinOffer`;
  const data = {};
  data.item = `country_minoffer`;
  return req(url, data);
};
