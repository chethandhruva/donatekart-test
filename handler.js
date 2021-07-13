
const axios = require('axios');

async function invoke(req) {
  const path = req.context["resource-path"];
  switch(path) {
    case '/campaign/list':
      return await list();
    case '/campaign/active':
      return await active();
    case '/campaign/closed':
      return await closed();
    default:
      break;
  }
  return {};
}

async function getAllCampaigns() {
  try {
    const res = await axios.get('https://testapi.donatekart.com/api/campaign');
    console.log(res.data.length);
    return res.data;
  }
  catch(err) {
    console.log(err);
  }
}

async function list() {
  const res = await getAllCampaigns();
  const sorted = res.sort( (a,b) => {
    return b.totalAmount - a.totalAmount;
  });
  const resp = [];
  sorted.map(e => resp.push({
    'Title' : e.title,
    'Total Amount' : e.totalAmount,
    'Backers Count' : e.backersCount,
    'End Date' : e.endDate
  }));
  return resp;
}

async function active() {
  const res = await getAllCampaigns();
  const activeCampaign = res.filter(e => new Date(e.endDate).getTime() >= Date.now())
  .filter(e => new Date(e.created).getTime() >= Date.now()-(30 * 24 * 60 * 60 * 1000));
  return activeCampaign;
}

async function closed() {
  const res = await getAllCampaigns();
  const closedCampaign = res.filter(e => new Date(e.endDate).getTime() < Date.now() || e.procuredAmount >= e.totalAmount);
  return closedCampaign;
}


module.exports = { invoke };