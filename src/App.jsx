import React, { useState, useEffect } from 'react';
import { 
  initializeData, 
  getTeamMembers, 
  getDeals, 
  saveTeamMembers, 
  saveDeals 
} from './data/dataUtils';
import TeamManagement from './components/TeamManagement';
import DealsManagement from './components/DealsManagement';
import StatisticsDashboard from './components/StatisticsDashboard';
import { Home, Users, Briefcase } from 'lucide-react';

function App() {
  const [selectedPage, setSelectedPage] = useState('dashboard');
  const [teamMembers, setTeamMembers] = useState([]);
  const [deals, setDeals] = useState([]);

  // Load saved data on component mount
  useEffect(() => {
    initializeData();
    setTeamMembers(getTeamMembers());
    setDeals(getDeals());
  }, []);

  // Handle team member updates
  const handleTeamMembersUpdate = (newTeamMembers) => {
    setTeamMembers(newTeamMembers);
    saveTeamMembers(newTeamMembers);
  };

  // Handle deals updates
  const handleDealsUpdate = (newDeals) => {
    setDeals(newDeals);
    saveDeals(newDeals);
  };

  // Navigation item component
  const NavItem = ({ icon: Icon, text, id }) => (
    <div
      className={`flex items-center p-4 cursor-pointer transition-colors duration-200 hover:bg-[#2A1B44] ${
        selectedPage === id ? 'bg-[#2A1B44]' : ''
      }`}
      onClick={() => setSelectedPage(id)}
    >
      <Icon className="mr-2" size={20} />
      <span>{text}</span>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar */}
      <div className="w-64 bg-[#422B69] text-[#FCF4FF] flex-shrink-0">
        <div className="p-4 border-b border-[#FCF4FF]/10">
          <h1 className="text-xl font-bold">Deal Management</h1>
        </div>
        <nav className="mt-4">
          <NavItem icon={Home} text="Dashboard" id="dashboard" />
          <NavItem icon={Users} text="Team Members" id="team" />
          <NavItem icon={Briefcase} text="Deals" id="deals" />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-r from-[#422B69] via-[#5B3D8C] to-[#6D088A]">
        <div className="p-4">
          {selectedPage === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#FCF4FF]">Dashboard</h2>
              <StatisticsDashboard 
                deals={deals} 
                teamMembers={teamMembers}
              />
            </div>
          )}
          
          {selectedPage === 'team' && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#FCF4FF]">Team Members</h2>
              <TeamManagement 
                teamMembers={teamMembers} 
                setTeamMembers={handleTeamMembersUpdate}
              />
            </div>
          )}
          
          {selectedPage === 'deals' && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#FCF4FF]">Deals</h2>
              <DealsManagement 
                teamMembers={teamMembers}
                deals={deals}
                setDeals={handleDealsUpdate}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;