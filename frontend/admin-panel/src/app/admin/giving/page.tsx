'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'  // Updated import
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

type Donation = {
    id: number
    documentId: string
    donor: string
    amount: number
    type: string
    date: string
    method: string
    reference?: string
    notes?: string
}

export default function GivingPage() {
    const [donations, setDonations] = useState<Donation[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingDonation, setEditingDonation] = useState<Donation | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [dateFilter, setDateFilter] = useState('')
    const [typeFilter, setTypeFilter] = useState('')
    const [formData, setFormData] = useState({
        donor: '',
        amount: '',
        type: 'Tithe',
        method: 'Cash',
        reference: '',
        notes: ''
    })

    useEffect(() => {
        loadDonations()
    }, [])

    async function loadDonations() {
        try {
            setLoading(true)
            const data = await api.getDonations()  // Updated call
            setDonations(data)
        } catch (error) {
            console.error('Failed to load donations:', error)
            alert('Failed to load donations. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    // Filter donations
    const filteredDonations = donations.filter(donation => {
        const matchesSearch = donation.donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (donation.reference && donation.reference.toLowerCase().includes(searchTerm.toLowerCase()))
        const matchesDate = !dateFilter || donation.date === dateFilter
        const matchesType = !typeFilter || donation.type === typeFilter
        return matchesSearch && matchesDate && matchesType
    })

    const resetForm = () => {
        setFormData({
            donor: '',
            amount: '',
            type: 'Tithe',
            method: 'Cash',
            reference: '',
            notes: ''
        })
        setEditingDonation(null)
        setShowForm(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const donationData = {
                ...formData,
                amount: parseFloat(formData.amount),
                date: new Date().toISOString().split('T')[0],
                reference: formData.reference || `TXN${Date.now()}`
            }

            if (editingDonation) {
                // Update existing donation
                await api.updateDonation(editingDonation.documentId, donationData)  // Updated call
            } else {
                // Create new donation
                await api.createDonation(donationData)  // Updated call
            }

            resetForm()
            loadDonations()
        } catch (error) {
            console.error('Failed to save donation:', error)
            alert('Failed to save donation. Please try again.')
        }
    }

    const handleEdit = (donation: Donation) => {
        setEditingDonation(donation)
        setFormData({
            donor: donation.donor,
            amount: donation.amount.toString(),
            type: donation.type,
            method: donation.method,
            reference: donation.reference || '',
            notes: donation.notes || ''
        })
        setShowForm(true)
    }

    const handleDelete = async (documentId: string) => {
        if (confirm('Are you sure you want to delete this donation record?')) {
            try {
                await api.deleteDonation(documentId)  // Updated call
                loadDonations()
            } catch (error) {
                console.error('Failed to delete donation:', error)
                alert('Failed to delete donation. Please try again.')
            }
        }
    }

    // Calculate totals
    const totalAmount = filteredDonations.reduce((sum, d) => sum + d.amount, 0)
    const monthlyTotal = donations.filter(d => {
        const donationDate = new Date(d.date)
        const now = new Date()
        return donationDate.getMonth() === now.getMonth() &&
            donationDate.getFullYear() === now.getFullYear()
    }).reduce((sum, d) => sum + d.amount, 0)

    const tithesTotal = donations.filter(d => d.type === 'Tithe').reduce((sum, d) => sum + d.amount, 0)
    const offeringsTotal = donations.filter(d => d.type === 'Offering').reduce((sum, d) => sum + d.amount, 0)

    const formatAmount = (amount: number) => `₦${amount.toLocaleString()}`

    const exportDonations = () => {
        const csv = [
            ['Date', 'Donor', 'Amount', 'Type', 'Method', 'Reference', 'Notes'],
            ...filteredDonations.map(d => [
                d.date,
                d.donor,
                d.amount,
                d.type,
                d.method,
                d.reference || '',
                d.notes || ''
            ])
        ].map(row => row.join(',')).join('\n')

        const blob = new Blob([csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'donations.csv'
        a.click()
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p>Loading donations...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Giving & Donations</h1>
                    <p className="text-gray-600">Manage donations and financial records</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={exportDonations}>
                        Export CSV
                    </Button>
                    <Button onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : 'Record Donation'}
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-600">Total Giving</h3>
                    <p className="text-2xl font-bold text-green-600">{formatAmount(totalAmount)}</p>
                    <p className="text-xs text-gray-500 mt-1">All time</p>
                </Card>
                <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-600">This Month</h3>
                    <p className="text-2xl font-bold text-blue-600">{formatAmount(monthlyTotal)}</p>
                    <p className="text-xs text-gray-500 mt-1">Current month</p>
                </Card>
                <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-600">Tithes</h3>
                    <p className="text-2xl font-bold text-purple-600">{formatAmount(tithesTotal)}</p>
                    <p className="text-xs text-gray-500 mt-1">All time</p>
                </Card>
                <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-600">Offerings</h3>
                    <p className="text-2xl font-bold text-orange-600">{formatAmount(offeringsTotal)}</p>
                    <p className="text-xs text-gray-500 mt-1">All time</p>
                </Card>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <Input
                        placeholder="Search by donor or reference..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    />
                    <select
                        className="px-3 py-2 border rounded-md"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="">All Types</option>
                        <option value="Tithe">Tithe</option>
                        <option value="Offering">Offering</option>
                        <option value="Building Fund">Building Fund</option>
                        <option value="Missions">Missions</option>
                        <option value="Special">Special</option>
                    </select>
                    <Button
                        variant="outline"
                        onClick={() => {
                            setSearchTerm('')
                            setDateFilter('')
                            setTypeFilter('')
                        }}
                    >
                        Clear Filters
                    </Button>
                </div>
            </Card>

            {/* Add/Edit Form */}
            {showForm && (
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        {editingDonation ? 'Edit Donation' : 'Record New Donation'}
                    </h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            placeholder="Donor Name"
                            value={formData.donor}
                            onChange={(e) => setFormData({ ...formData, donor: e.target.value })}
                            required
                        />
                        <Input
                            type="number"
                            step="0.01"
                            placeholder="Amount (₦)"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            required
                        />
                        <select
                            className="px-3 py-2 border rounded-md"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="Tithe">Tithe</option>
                            <option value="Offering">Offering</option>
                            <option value="Building Fund">Building Fund</option>
                            <option value="Missions">Missions</option>
                            <option value="Special">Special</option>
                        </select>
                        <select
                            className="px-3 py-2 border rounded-md"
                            value={formData.method}
                            onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                        >
                            <option value="Cash">Cash</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Online">Online</option>
                            <option value="Cheque">Cheque</option>
                            <option value="Mobile Money">Mobile Money</option>
                        </select>
                        <Input
                            placeholder="Reference Number (optional)"
                            value={formData.reference}
                            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                        />
                        <Input
                            placeholder="Notes (optional)"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                        <div className="md:col-span-2 flex gap-2">
                            <Button type="submit">
                                {editingDonation ? 'Update Donation' : 'Record Donation'}
                            </Button>
                            <Button type="button" variant="outline" onClick={resetForm}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Online Giving Setup */}
            <Card className="p-6 bg-blue-50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="font-semibold text-lg">Online Giving Integration</h3>
                        <p className="text-sm text-gray-600">
                            Connect with payment providers to enable online donations
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm">Setup Paystack</Button>
                        <Button size="sm" variant="outline">Setup Flutterwave</Button>
                    </div>
                </div>
            </Card>

            {/* Donations List */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold">
                    Donations ({filteredDonations.length})
                </h3>
                {filteredDonations.map((donation) => (
                    <Card key={donation.id} className="p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                    <h4 className="font-medium text-lg">{donation.donor}</h4>
                                    <p className="text-sm text-gray-600">
                                        {donation.type} • {donation.method}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Ref: {donation.reference}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-green-600">
                                        {formatAmount(donation.amount)}
                                    </p>
                                    <p className="text-sm text-gray-600">{donation.date}</p>
                                    {donation.notes && (
                                        <p className="text-sm text-gray-500 italic">{donation.notes}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEdit(donation)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => alert(`Receipt for ${donation.reference}`)}
                                >
                                    Receipt
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDelete(donation.documentId)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}

                {filteredDonations.length === 0 && (
                    <Card className="p-8 text-center">
                        <p className="text-gray-500">No donations found matching your filters.</p>
                    </Card>
                )}
            </div>
        </div>
    )
}