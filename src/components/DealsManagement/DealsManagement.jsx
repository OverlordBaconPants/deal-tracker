import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Plus, Edit, Trash, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { ROLE_PERCENTAGES } from '../../data/dataUtils';

const ROLES = Object.keys(ROLE_PERCENTAGES);
const STATUSES = ['In Progress', 'Complete', 'Dead'];
const DEALS_PER_PAGE = 3;

export default function DealsManagement({ teamMembers, deals, setDeals }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentDeal, setCurrentDeal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleAddDeal = () => {
    setCurrentDeal(null);
    setIsDialogOpen(true);
  };

  const handleEditDeal = (deal) => {
    setCurrentDeal(deal);
    setIsDialogOpen(true);
  };

  const handleDeleteDeal = (dealId) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      setDeals(deals.filter(d => d.id !== dealId));
    }
  };

  const handleSaveDeal = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const dealData = {
      id: currentDeal?.id || Date.now(),
      propertyAddress: formData.get('propertyAddress'),
      assignmentFee: parseFloat(formData.get('assignmentFee')),
      dateFirstContact: formData.get('dateFirstContact'),
      dateClosed: formData.get('dateClosed') || null,
      status: formData.get('status'),
      roles: {}
    };

    // Collect role assignments
    ROLES.forEach(role => {
      const memberId = formData.get(`role_${role}`);
      if (memberId) {
        dealData.roles[role] = memberId;
      }
    });

    if (currentDeal) {
      setDeals(deals.map(d => d.id === currentDeal.id ? dealData : d));
    } else {
      setDeals([...deals, dealData]);
    }
    setIsDialogOpen(false);
  };

  const filteredDeals = deals.filter(deal =>
    deal.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDeals.length / DEALS_PER_PAGE);
  const startIndex = (currentPage - 1) * DEALS_PER_PAGE;
  const visibleDeals = filteredDeals.slice(startIndex, startIndex + DEALS_PER_PAGE);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by property address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button onClick={handleAddDeal}>
          <Plus className="w-4 h-4 mr-2" />
          Add Deal
        </Button>
      </div>

      <div className="grid gap-4">
        {visibleDeals.map(deal => (
          <Card key={deal.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-medium">
                    {deal.propertyAddress}
                  </CardTitle>
                  <div className="text-sm text-gray-500">
                    Status: {deal.status} | Assignment Fee: {formatCurrency(deal.assignmentFee)}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditDeal(deal)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700" 
                    onClick={() => handleDeleteDeal(deal.id)}
                  >
                    <Trash className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 mt-2">
                {ROLES.map(role => (
                  <div key={role} className="text-sm">
                    <div className="font-medium">{role}</div>
                    {deal.roles[role] ? (
                      <>
                        <div>{teamMembers.find(m => m.id === deal.roles[role])?.name}</div>
                        <div className="text-gray-500">
                          {formatCurrency(deal.calculations.roleFees[role])}
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-400">Not Assigned</div>
                    )}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                <div>
                  <div className="text-sm font-medium">DMREI Gross</div>
                  <div className="text-gray-600">{formatCurrency(deal.calculations.dmreiGrossProfit)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">WebPro Profit</div>
                  <div className="text-gray-600">{formatCurrency(deal.calculations.webProProfit)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium">DMREI Net</div>
                  <div className="text-gray-600">{formatCurrency(deal.calculations.dmreiNetProfit)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentDeal ? 'Edit Deal' : 'Add Deal'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveDeal}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-[#422B69] font-medium">Property Address</label>
                <Input
                  name="propertyAddress"
                  defaultValue={currentDeal?.propertyAddress || ''}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label className="text-[#422B69] font-medium">Assignment Fee</label>
                <Input
                  type="number"
                  name="assignmentFee"
                  defaultValue={currentDeal?.assignmentFee || ''}
                  min="0"
                  max="20000"
                  required
                />
              </div>
              <div className="grid gap-2">
                <label className="text-[#422B69] font-medium">Date of First Contact</label>
                <Input
                  type="date"
                  name="dateFirstContact"
                  defaultValue={currentDeal?.dateFirstContact || ''}
                  required
                />
              </div>
              <div className="grid gap-2">
                <label className="text-[#422B69] font-medium">Date Closed</label>
                <Input
                  type="date"
                  name="dateClosed"
                  defaultValue={currentDeal?.dateClosed || ''}
                />
              </div>
              <div className="grid gap-2">
                <label className="text-[#422B69] font-medium">Status</label>
                <select 
                  name="status"
                  className="w-full rounded-md border border-[#422B69]/20 bg-[#FCF4FF] px-3 py-2 text-[#422B69] focus:outline-none focus:ring-2 focus:ring-[#000080]"
                  defaultValue={currentDeal?.status || 'In Progress'}
                  required
                >
                  {STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              {ROLES.map(role => (
                <div key={role} className="grid gap-2">
                  <label className="text-[#422B69] font-medium">{role}</label>
                  <select
                    name={`role_${role}`}
                    className="w-full rounded-md border border-[#422B69]/20 bg-[#FCF4FF] px-3 py-2 text-[#422B69] focus:outline-none focus:ring-2 focus:ring-[#000080]"
                    defaultValue={currentDeal?.roles[role] || ''}
                  >
                    <option value="" className="text-[#422B69]">Select {role}</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.id} className="text-[#422B69]">
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-[#422B69] text-[#FCF4FF] hover:bg-[#422B69]/90">
                Save Deal
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}