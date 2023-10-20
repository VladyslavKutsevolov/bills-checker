const { authClient } = require("./authClient");
const pluralize = require("pluralize");

const fetchBills = async (lastInvocationTime) => {
  let query = "SELECT * FROM Bill";
  if (lastInvocationTime) {
    query += ` WHERE Metadata.LastUpdatedTime >= '${lastInvocationTime}'`;
  }
  const encodedQuery = encodeURIComponent(query);
  return await authClient.makeApiCall({
    url: `https://sandbox-quickbooks.api.intuit.com/v3/company/${process.env.QB_REALM_ID}/query?query=${encodedQuery}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.QB_ACCESS_TOKEN}`,
      Accept: "application/json",
    },
  });
};

const billChecker = () => {
  let lastInvocationTime = null;
  let previousBills = {};
  let firstInvocation = true;

  return async () => {
    try {
      const currentTime = new Date().toISOString();
      const response = await fetchBills(lastInvocationTime);

      const bills = response.json.QueryResponse.Bill || [];
      const newBills = {};
      const added = [];
      const modified = [];

      bills.forEach((bill) => {
        newBills[bill.Id] = bill.MetaData.LastUpdatedTime;

        if (!previousBills[bill.Id]) {
          added.push({ ...bill, actionPerformed: "added" });
        } else if (previousBills[bill.Id] !== bill.MetaData.LastUpdatedTime) {
          modified.push({ ...bill, actionPerformed: "modified" });
        }
      });

      Object.keys(newBills).forEach((id) => {
        previousBills[id] = newBills[id];
      });

      lastInvocationTime = currentTime;

      if (firstInvocation) {
        firstInvocation = false;
        return { message: "No previous invocation" };
      }

      const message = [
        added.length
          ? `${added.length} ${pluralize("addition", added.length)}`
          : null,
        modified.length
          ? `${modified.length} ${pluralize("change", modified.length)}`
          : null,
      ]
        .filter(Boolean)
        .join(" ");

      return {
        bills: [...added, ...modified],
        message: message || "No changes detected",
      };
    } catch (error) {
      console.error(error);
      return "Internal Server Error";
    }
  };
};

module.exports = { checkBills: billChecker(), fetchBills };
