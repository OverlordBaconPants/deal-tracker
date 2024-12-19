import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { ROLE_PERCENTAGES } from '../../data/dataUtils';

// Using ROLE_PERCENTAGES to ensure consistency with deals
const AVAILABLE_ROLES = Object.keys(ROLE_PERCENTAGES);

export default function TeamManagement({ teamMembers, setTeamMembers }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddMember = () => {
    setCurrentMember(null);
    setIsDialogOpen(true);
  };

  const handleEditMember = (member) => {
    setCurrentMember(member);
    setIsDialogOpen(true);
  };

  const handleDeleteMember = (memberId) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      setTeamMembers(teamMembers.filter(m => m.id !== memberId));
    }
  };

  const handleSaveMember = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const selectedRoles = AVAILABLE_ROLES.filter(role => formData.get(`role_${role}`) === 'on');
    
    const memberData = {
      id: currentMember?.id || Date.now().toString(), // Convert to string to match existing IDs
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      roles: selectedRoles
    };

    if (currentMember) {
      setTeamMembers(teamMembers.map(m => m.id === currentMember.id ? memberData : m));
    } else {
      setTeamMembers([...teamMembers, memberData]);
    }
    setIsDialogOpen(false);
  };

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Input
          placeholder="Search team members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-64"
        />
        <Button onClick={handleAddMember}>
          <Plus className="w-4 h-4 mr-2" />
          Add Team Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map(member => (
          <Card key={member.id} className="bg-white">
            <CardHeader>
              <div className="flex justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{member.name}</CardTitle>
                  {member.email && (
                    <p className="text-sm text-gray-500 mb-1">{member.email}</p>
                  )}
                  {member.phone && (
                    <p className="text-sm text-gray-500 mb-2">{member.phone}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {member.roles?.map(role => (
                      <span 
                        key={role} 
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => handleEditMember(member)}
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteMember(member.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentMember ? 'Edit Team Member' : 'Add Team Member'}
            </DialogTitle>
            <DialogDescription>
              {currentMember ? 'Edit the team member details below.' : 'Add a new team member to the system.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveMember}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-[#422B69]">Name</label>
              <Input
                id="name"
                name="name"
                placeholder="Enter team member name"
                defaultValue={currentMember?.name || ''}
                required
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email" className="text-[#422B69]">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                defaultValue={currentMember?.email || ''}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="phone" className="text-[#422B69]">Phone</label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter phone number"
                defaultValue={currentMember?.phone || ''}
              />
            </div>
              <div className="grid gap-2">
                <label className="font-medium text-[#422B69]">Roles</label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_ROLES.map(role => (
                    <label key={role} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name={`role_${role}`}
                        defaultChecked={currentMember?.roles?.includes(role)}
                        className="rounded border-[#422B69] text-[#000080] focus:ring-[#000080]"
                      />
                      <span className="text-[#422B69]">{role}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}