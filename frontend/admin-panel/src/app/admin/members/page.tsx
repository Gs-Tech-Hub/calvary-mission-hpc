'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'  // Updated import
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

type Member = {
    id: number
    documentId: string
    name: string
    email: string
    phone?: string
    address?: string
    joinDate?: string
    member_status: string
    department?: string
    birthDate?: string
    maritalStatus?: string
}

export default function MembersPage() {
    const [members, setMembers] = useState<Member[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingMember, setEditingMember] = useState<Member | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        member_status: 'Active',
        department: '',
        birthDate: '',
        maritalStatus: 'Single'
    })

    useEffect(() => {
        loadMembers()
    }, [])

    async function loadMembers() {
        try {
            setLoading(true)
            const data = await api.getMembers()  // Updated call
            console.log(data);
            setMembers(data)
        } catch (error) {
            console.error('Failed to load members:', error)
            alert('Failed to load members. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    // Filter members based on search
    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.phone && member.phone.includes(searchTerm))
    )

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            address: '',
            member_status: 'Active',
            department: '',
            birthDate: '',
            maritalStatus: 'Single'
        })
        setEditingMember(null)
        setShowForm(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            if (editingMember) {
                // Update existing member
                await api.updateMember(editingMember.documentId, formData)  // Updated call
            } else {
                // Create new member
                await api.createMember({  // Updated call
                    ...formData,
                    joinDate: new Date().toISOString().split('T')[0]
                })
            }

            resetForm()
            loadMembers()
        } catch (error) {
            console.error('Failed to save member:', error)
            alert('Failed to save member. Please try again.')
        }
    }

    const handleEdit = (member: Member) => {
        setEditingMember(member)
        setFormData({
            name: member.name,
            email: member.email,
            phone: member.phone || '',
            address: member.address || '',
            member_status: member.member_status,
            department: member.department || '',
            birthDate: member.birthDate || '',
            maritalStatus: member.maritalStatus || 'Single'
        })
        setShowForm(true)
    }

    const handleDelete = async (documentId: string) => {
        console.log(documentId)
        if (confirm('Are you sure you want to delete this member?')) {
            try {
                await api.deleteMember(documentId)  // Updated call
                loadMembers()
            } catch (error) {
                console.error('Failed to delete member:', error)
                alert('Failed to delete member. Please try again.')
            }
        }
    }

    const exportMembers = () => {
        const csv = [
            ['Name', 'Email', 'Phone', 'Address', 'Status', 'Department', 'Join Date', 'Birth Date', 'Marital Status'],
            ...members.map(m => [
                m.name,
                m.email,
                m.phone || '',
                m.address || '',
                m.member_status,
                m.department || '',
                m.joinDate || '',
                m.birthDate || '',
                m.maritalStatus || ''
            ])
        ].map(row => row.join(',')).join('\n')

        const blob = new Blob([csv], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'members.csv'
        a.click()
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p>Loading members...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Members Management</h1>
                    <p className="text-gray-600">Manage church members and their information</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={exportMembers}>
                        Export CSV
                    </Button>
                    <Button onClick={() => setShowForm(!showForm)}>
                        {showForm ? 'Cancel' : 'Add Member'}
                    </Button>
                </div>
            </div>

            {/* Search */}
            <Card className="p-4">
                <Input
                    placeholder="Search members by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-md"
                />
            </Card>

            {/* Add/Edit Form */}
            {showForm && (
                <Card className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        {editingMember ? 'Edit Member' : 'Add New Member'}
                    </h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <Input
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <Input
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                        <Input
                            placeholder="Address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                        <Input
                            type="date"
                            placeholder="Birth Date"
                            value={formData.birthDate}
                            onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                        />
                        <select
                            className="px-3 py-2 border rounded-md"
                            value={formData.maritalStatus}
                            onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                        >
                            <option value="Single">Single</option>
                            <option value="Married">Married</option>
                            <option value="Divorced">Divorced</option>
                            <option value="Widowed">Widowed</option>
                        </select>
                        <select
                            className="px-3 py-2 border rounded-md"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        >
                            <option value="">Select Department</option>
                            <option value="Ushering">Ushering</option>
                            <option value="Choir">Choir</option>
                            <option value="Media">Media</option>
                            <option value="Children">Children</option>
                            <option value="Youth">Youth</option>
                            <option value="Prayer">Prayer</option>
                        </select>
                        <select
                            className="px-3 py-2 border rounded-md"
                            value={formData.member_status}
                            onChange={(e) => setFormData({ ...formData, member_status: e.target.value })}
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                            <option value="Visitor">Visitor</option>
                        </select>
                        <div className="md:col-span-2 flex gap-2">
                            <Button type="submit">
                                {editingMember ? 'Update Member' : 'Add Member'}
                            </Button>
                            <Button type="button" variant="outline" onClick={resetForm}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-600">Total Members</h3>
                    <p className="text-2xl font-bold">{members.length}</p>
                </Card>
                <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-600">Active Members</h3>
                    <p className="text-2xl font-bold text-green-600">
                        {members.filter(m => m.member_status === 'Active').length}
                    </p>
                </Card>
                <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-600">New This Month</h3>
                    <p className="text-2xl font-bold text-blue-600">
                        {members.filter(m => {
                            if (!m.joinDate) return false
                            const joinDate = new Date(m.joinDate)
                            const now = new Date()
                            return joinDate.getMonth() === now.getMonth() &&
                                joinDate.getFullYear() === now.getFullYear()
                        }).length}
                    </p>
                </Card>
                <Card className="p-4">
                    <h3 className="text-sm font-medium text-gray-600">Departments</h3>
                    <p className="text-2xl font-bold text-purple-600">
                        {new Set(members.map(m => m.department).filter(d => d)).size}
                    </p>
                </Card>
            </div>

            {/* Members List */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold">
                    Members ({filteredMembers.length})
                </h3>
                {filteredMembers.map((member) => (
                    <Card key={member.id} className="p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                    <h4 className="font-medium text-lg">{member.name}</h4>
                                    <p className="text-sm text-gray-600">{member.email}</p>
                                    <p className="text-sm text-gray-600">{member.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        <strong>Department:</strong> {member.department || 'None'}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>Joined:</strong> {member.joinDate || 'N/A'}
                                    </p>
                                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${member.member_status === 'Active' ? 'bg-green-100 text-green-800' :
                                        member.member_status === 'Inactive' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {member.member_status}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEdit(member)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => alert(`Viewing details for ${member.name}`)}
                                >
                                    View
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleDelete(member.documentId)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}

                {filteredMembers.length === 0 && (
                    <Card className="p-8 text-center">
                        <p className="text-gray-500">No members found matching your search.</p>
                    </Card>
                )}
            </div>
        </div>
    )
}