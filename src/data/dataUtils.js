// Import initial data
import teamMembersData from './teamMembers.json';
import dealsData from './deals.json';

// Role percentages for fee calculations
const ROLE_PERCENTAGES = {
  Hunter: 0.30,
  Closer: 0.20,
  Dispo: 0.20,
  Architect: 0.03,
  Mentor: 0.006,
  Dynamo: 0.009
};

// Calculate fees for a deal
const calculateFees = (assignmentFee, roles) => {
  const fees = {};
  let totalRoleFees = 0;

  // Calculate individual role fees
  Object.keys(ROLE_PERCENTAGES).forEach(role => {
    if (roles[role]) {
      fees[role] = assignmentFee * ROLE_PERCENTAGES[role];
      totalRoleFees += fees[role];
    } else {
      fees[role] = 0;
    }
  });

  // Calculate profits
  const dmreiGrossProfit = assignmentFee - totalRoleFees;
  const webProProfit = dmreiGrossProfit * 0.30;
  const dmreiNetProfit = dmreiGrossProfit - webProProfit;

  return {
    roleFees: fees,
    dmreiGrossProfit,
    webProProfit,
    dmreiNetProfit
  };
};

// Add calculations to a deal
const addCalculations = (deal) => {
  return {
    ...deal,
    calculations: calculateFees(deal.assignmentFee, deal.roles)
  };
};

// Check if data needs initialization
const needsInitialization = () => {
  const teamMembers = localStorage.getItem('teamMembers');
  const deals = localStorage.getItem('deals');
  return !teamMembers || !deals || 
         JSON.parse(teamMembers).length === 0 || 
         JSON.parse(deals).length === 0;
};

// Initialize localStorage with sample data
export const initializeData = () => {
  console.log('Checking if data needs initialization...');
  
  if (needsInitialization()) {
    console.log('Initializing data with default values...');
    
    // Add calculations to deals before storing
    const dealsWithCalculations = dealsData.deals.map(addCalculations);
    
    localStorage.setItem('teamMembers', JSON.stringify(teamMembersData.teamMembers));
    localStorage.setItem('deals', JSON.stringify(dealsWithCalculations));
    
    console.log('Data initialization complete');
  } else {
    console.log('Data already initialized, skipping...');
  }
};

// Get data with fallback to initial data
export const getTeamMembers = () => {
  const data = localStorage.getItem('teamMembers');
  if (!data) {
    // If no data in localStorage, initialize and return default data
    initializeData();
    return teamMembersData.teamMembers;
  }
  return JSON.parse(data);
};

export const getDeals = () => {
  const data = localStorage.getItem('deals');
  if (!data) {
    // If no data in localStorage, initialize and return default data
    initializeData();
    return dealsData.deals.map(addCalculations);
  }
  const deals = JSON.parse(data);
  // Ensure calculations are present even if loaded from localStorage
  return deals.map(addCalculations);
};

// Save data
export const saveTeamMembers = (teamMembers) => {
  localStorage.setItem('teamMembers', JSON.stringify(teamMembers));
};

export const saveDeals = (deals) => {
  // Ensure calculations are present when saving
  const dealsWithCalculations = deals.map(addCalculations);
  localStorage.setItem('deals', JSON.stringify(dealsWithCalculations));
};

// Export for use in other components
export { ROLE_PERCENTAGES, calculateFees };