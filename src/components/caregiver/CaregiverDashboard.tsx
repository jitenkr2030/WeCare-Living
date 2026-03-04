'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  Settings, 
  Shield, 
  Eye, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  User, 
  Crown, 
  Star, 
  Heart, 
  Activity, 
  Bell, 
  Lock, 
  Unlock, 
  RefreshCw,
  Download,
  Filter,
  Search
} from 'lucide-react';

// Import types
import { Resident } from '@/types/presence';

interface Caregiver {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'primary' | 'secondary' | 'family' | 'viewer';
  avatar?: string;
  department: string;
  status: 'active' | 'inactive' | 'on_leave';
  permissions: string[];
  assignedResidents: string[];
  lastLogin: Date;
  joinDate: Date;
  certifications: string[];
  performance: {
    responseTime: number;
    satisfaction: number;
    completedTasks: number;
    activeAlerts: number;
  };
}

interface FamilyMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  relationship: string;
  residentId: string;
  residentName: string;
  avatar?: string;
  accessLevel: 'full' | 'limited' | 'emergency_only';
  notifications: {
    email: boolean;
    sms: boolean;
    app: boolean;
    emergency: boolean;
  };
  lastAccess: Date;
  status: 'active' | 'inactive';
}

interface Role {
  id: string;
  name: string;
  level: number;
  permissions: string[];
  color: string;
  icon: React.ReactNode;
  description: string;
}

interface CaregiverDashboardProps {
  residents: Resident[];
}

const CaregiverDashboard: React.FC<CaregiverDashboardProps> = ({ residents }) => {
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('caregivers');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Define roles with permissions
  const roles: Role[] = [
    {
      id: 'primary',
      name: 'Primary Caregiver',
      level: 4,
      permissions: [
        'view_all_residents',
        'manage_alerts',
        'assign_tasks',
        'view_reports',
        'manage_caregivers',
        'emergency_response',
        'view_vitals',
        'manage_schedules'
      ],
      color: 'purple',
      icon: <Crown className="w-4 h-4" />,
      description: 'Full access to all features and residents'
    },
    {
      id: 'secondary',
      name: 'Secondary Caregiver',
      level: 3,
      permissions: [
        'view_assigned_residents',
        'manage_alerts',
        'view_reports',
        'view_vitals',
        'emergency_response'
      ],
      color: 'blue',
      icon: <UserCheck className="w-4 h-4" />,
      description: 'Access to assigned residents and essential features'
    },
    {
      id: 'family',
      name: 'Family Member',
      level: 2,
      permissions: [
        'view_assigned_residents',
        'view_reports',
        'receive_alerts',
        'emergency_contact'
      ],
      color: 'green',
      icon: <Heart className="w-4 h-4" />,
      description: 'Limited access to specific resident information'
    },
    {
      id: 'viewer',
      name: 'Viewer',
      level: 1,
      permissions: [
        'view_assigned_residents',
        'view_reports'
      ],
      color: 'gray',
      icon: <Eye className="w-4 h-4" />,
      description: 'Read-only access to resident information'
    }
  ];

  // Generate mock caregivers
  const caregivers: Caregiver[] = useMemo(() => [
    {
      id: 'caregiver-1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@wecareliving.com',
      phone: '+1 (555) 123-4567',
      role: 'primary',
      department: 'Nursing',
      status: 'active',
      permissions: roles.find(r => r.id === 'primary')?.permissions || [],
      assignedResidents: ['resident-1', 'resident-2', 'resident-3'],
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
      joinDate: new Date('2022-03-15'),
      certifications: ['RN', 'BLS', 'Critical Care'],
      performance: {
        responseTime: 4.2,
        satisfaction: 94,
        completedTasks: 147,
        activeAlerts: 3
      }
    },
    {
      id: 'caregiver-2',
      name: 'Michael Chen',
      email: 'michael.chen@wecareliving.com',
      phone: '+1 (555) 234-5678',
      role: 'secondary',
      department: 'Nursing',
      status: 'active',
      permissions: roles.find(r => r.id === 'secondary')?.permissions || [],
      assignedResidents: ['resident-4', 'resident-5'],
      lastLogin: new Date(Date.now() - 30 * 60 * 1000),
      joinDate: new Date('2023-01-20'),
      certifications: ['LVN', 'First Aid'],
      performance: {
        responseTime: 5.8,
        satisfaction: 88,
        completedTasks: 89,
        activeAlerts: 1
      }
    },
    {
      id: 'caregiver-3',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@wecareliving.com',
      phone: '+1 (555) 345-6789',
      role: 'secondary',
      department: 'Physical Therapy',
      status: 'active',
      permissions: roles.find(r => r.id === 'secondary')?.permissions || [],
      assignedResidents: ['resident-2', 'resident-6'],
      lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000),
      joinDate: new Date('2022-08-10'),
      certifications: ['PT', 'DPT', 'Geriatrics'],
      performance: {
        responseTime: 3.9,
        satisfaction: 96,
        completedTasks: 112,
        activeAlerts: 0
      }
    },
    {
      id: 'caregiver-4',
      name: 'David Kim',
      email: 'david.kim@wecareliving.com',
      phone: '+1 (555) 456-7890',
      role: 'family',
      department: 'Family',
      status: 'active',
      permissions: roles.find(r => r.id === 'family')?.permissions || [],
      assignedResidents: ['resident-1'],
      lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000),
      joinDate: new Date('2023-06-01'),
      certifications: [],
      performance: {
        responseTime: 8.2,
        satisfaction: 91,
        completedTasks: 23,
        activeAlerts: 0
      }
    }
  ], []);

  // Generate mock family members
  const familyMembers: FamilyMember[] = useMemo(() => [
    {
      id: 'family-1',
      name: 'Robert Smith',
      email: 'robert.smith@email.com',
      phone: '+1 (555) 111-2222',
      relationship: 'Son',
      residentId: 'resident-1',
      residentName: 'John Smith',
      accessLevel: 'full',
      notifications: {
        email: true,
        sms: true,
        app: true,
        emergency: true
      },
      lastAccess: new Date(Date.now() - 45 * 60 * 1000),
      status: 'active'
    },
    {
      id: 'family-2',
      name: 'Mary Smith',
      email: 'mary.smith@email.com',
      phone: '+1 (555) 222-3333',
      relationship: 'Daughter',
      residentId: 'resident-1',
      residentName: 'John Smith',
      accessLevel: 'full',
      notifications: {
        email: true,
        sms: false,
        app: true,
        emergency: true
      },
      lastAccess: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'active'
    },
    {
      id: 'family-3',
      name: 'Jennifer Johnson',
      email: 'jennifer.j@email.com',
      phone: '+1 (555) 333-4444',
      relationship: 'Spouse',
      residentId: 'resident-2',
      residentName: 'Mary Johnson',
      accessLevel: 'limited',
      notifications: {
        email: false,
        sms: true,
        app: true,
        emergency: true
      },
      lastAccess: new Date(Date.now() - 6 * 60 * 60 * 1000),
      status: 'active'
    }
  ], []);

  // Filter caregivers based on selected criteria
  const filteredCaregivers = useMemo(() => {
    let filtered = [...caregivers];

    if (selectedRole !== 'all') {
      filtered = filtered.filter(caregiver => caregiver.role === selectedRole);
    }

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(caregiver => caregiver.department === selectedDepartment);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(caregiver => 
        caregiver.name.toLowerCase().includes(query) ||
        caregiver.email.toLowerCase().includes(query) ||
        caregiver.department.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [caregivers, selectedRole, selectedDepartment, searchQuery]);

  // Filter family members
  const filteredFamilyMembers = useMemo(() => {
    let filtered = [...familyMembers];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(member => 
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query) ||
        member.residentName.toLowerCase().includes(query) ||
        member.relationship.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [familyMembers, searchQuery]);

  const getRoleColor = (role: string) => {
    const roleConfig = roles.find(r => r.id === role);
    return roleConfig?.color || 'gray';
  };

  const getRoleIcon = (role: string) => {
    const roleConfig = roles.find(r => r.id === role);
    return roleConfig?.icon || <User className="w-4 h-4" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Caregiver & Family Management</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{caregivers.length}</p>
              <p className="text-sm text-gray-600">Total Caregivers</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <UserCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">
                {caregivers.filter(c => c.status === 'active').length}
              </p>
              <p className="text-sm text-gray-600">Active Staff</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{familyMembers.length}</p>
              <p className="text-sm text-gray-600">Family Members</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Activity className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-600">
                {caregivers.reduce((acc, c) => acc + c.assignedResidents.length, 0)}
              </p>
              <p className="text-sm text-gray-600">Total Assignments</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search caregivers or family members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map(role => (
                  <SelectItem key={role.id} value={role.id}>
                    <div className="flex items-center space-x-2">
                      {role.icon}
                      <span>{role.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="Nursing">Nursing</SelectItem>
                <SelectItem value="Physical Therapy">Physical Therapy</SelectItem>
                <SelectItem value="Family">Family</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="caregivers">Caregivers</TabsTrigger>
          <TabsTrigger value="family">Family Members</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="caregivers">
          <Card>
            <CardHeader>
              <CardTitle>Caregiver Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredCaregivers.map((caregiver) => (
                    <motion.div
                      key={caregiver.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={caregiver.avatar} />
                            <AvatarFallback>
                              {caregiver.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold">{caregiver.name}</h3>
                              <Badge className={`${getRoleColor(caregiver.role)} text-xs`}>
                                <div className="flex items-center space-x-1">
                                  {getRoleIcon(caregiver.role)}
                                  <span>{roles.find(r => r.id === caregiver.role)?.name}</span>
                                </div>
                              </Badge>
                              <Badge className={getStatusColor(caregiver.status)}>
                                {caregiver.status}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2 text-sm">
                                  <Mail className="w-4 h-4 text-gray-400" />
                                  <span>{caregiver.email}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                  <Phone className="w-4 h-4 text-gray-400" />
                                  <span>{caregiver.phone}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                  <Users className="w-4 h-4 text-gray-400" />
                                  <span>{caregiver.department}</span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2 text-sm">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                  <span>Joined {caregiver.joinDate.toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  <span>Last login {caregiver.lastLogin.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                  <UserCheck className="w-4 h-4 text-gray-400" />
                                  <span>{caregiver.assignedResidents.length} residents</span>
                                </div>
                              </div>
                            </div>

                            {/* Performance Metrics */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-gray-50 rounded-lg">
                              <div className="text-center">
                                <p className={`text-lg font-semibold ${getPerformanceColor(caregiver.performance.responseTime)}`}>
                                  {caregiver.performance.responseTime}m
                                </p>
                                <p className="text-xs text-gray-600">Response Time</p>
                              </div>
                              <div className="text-center">
                                <p className={`text-lg font-semibold ${getPerformanceColor(caregiver.performance.satisfaction)}`}>
                                  {caregiver.performance.satisfaction}%
                                </p>
                                <p className="text-xs text-gray-600">Satisfaction</p>
                              </div>
                              <div className="text-center">
                                <p className="text-lg font-semibold text-blue-600">
                                  {caregiver.performance.completedTasks}
                                </p>
                                <p className="text-xs text-gray-600">Tasks Done</p>
                              </div>
                              <div className="text-center">
                                <p className="text-lg font-semibold text-orange-600">
                                  {caregiver.performance.activeAlerts}
                                </p>
                                <p className="text-xs text-gray-600">Active Alerts</p>
                              </div>
                            </div>

                            {/* Certifications */}
                            {caregiver.certifications.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {caregiver.certifications.map((cert, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {cert}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="family">
          <Card>
            <CardHeader>
              <CardTitle>Family Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredFamilyMembers.map((member) => (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold">{member.name}</h3>
                              <Badge variant="outline">
                                {member.relationship}
                              </Badge>
                              <Badge className={getStatusColor(member.status)}>
                                {member.status}
                              </Badge>
                              <Badge variant="secondary">
                                {member.accessLevel.replace('_', ' ')}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2 text-sm">
                                  <Heart className="w-4 h-4 text-gray-400" />
                                  <span>{member.residentName}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                  <Mail className="w-4 h-4 text-gray-400" />
                                  <span>{member.email}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                  <Phone className="w-4 h-4 text-gray-400" />
                                  <span>{member.phone}</span>
                                </div>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2 text-sm">
                                  <Clock className="w-4 h-4 text-gray-400" />
                                  <span>Last access {member.lastAccess.toLocaleString()}</span>
                                </div>
                              </div>
                            </div>

                            {/* Notification Preferences */}
                            <div className="flex flex-wrap gap-2">
                              {member.notifications.email && (
                                <Badge variant="secondary" className="text-xs">
                                  <Mail className="w-3 h-3 mr-1" />
                                  Email
                                </Badge>
                              )}
                              {member.notifications.sms && (
                                <Badge variant="secondary" className="text-xs">
                                  <Phone className="w-3 h-3 mr-1" />
                                  SMS
                                </Badge>
                              )}
                              {member.notifications.app && (
                                <Badge variant="secondary" className="text-xs">
                                  <Bell className="w-3 h-3 mr-1" />
                                  App
                                </Badge>
                              )}
                              {member.notifications.emergency && (
                                <Badge variant="destructive" className="text-xs">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Emergency
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roles.map((role) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className={`border-l-4 border-l-${role.color}-500`}>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <div className={`p-2 rounded-full bg-${role.color}-100`}>
                            {role.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold">{role.name}</h3>
                            <p className="text-sm text-gray-600">Level {role.level}</p>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 mb-4">{role.description}</p>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Permissions:</h4>
                          <div className="flex flex-wrap gap-2">
                            {role.permissions.map((permission, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {permission.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Performance Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Response Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {caregivers.slice(0, 3).map((caregiver) => (
                          <div key={caregiver.id} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{caregiver.name}</span>
                            <div className="flex items-center space-x-2">
                              <Progress 
                                value={Math.max(0, 100 - caregiver.performance.responseTime * 10)} 
                                className="w-20 h-2" 
                              />
                              <span className={`text-sm font-medium ${getPerformanceColor(caregiver.performance.responseTime)}`}>
                                {caregiver.performance.responseTime}m
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Satisfaction Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {caregivers.slice(0, 3).map((caregiver) => (
                          <div key={caregiver.id} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{caregiver.name}</span>
                            <div className="flex items-center space-x-2">
                              <Progress value={caregiver.performance.satisfaction} className="w-20 h-2" />
                              <span className={`text-sm font-medium ${getPerformanceColor(caregiver.performance.satisfaction)}`}>
                                {caregiver.performance.satisfaction}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Task Completion</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {caregivers.slice(0, 3).map((caregiver) => (
                          <div key={caregiver.id} className="flex items-center justify-between">
                            <span className="text-sm font-medium">{caregiver.name}</span>
                            <div className="flex items-center space-x-2">
                              <Progress 
                                value={Math.min(100, caregiver.performance.completedTasks)} 
                                className="w-20 h-2" 
                              />
                              <span className="text-sm font-medium text-blue-600">
                                {caregiver.performance.completedTasks}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CaregiverDashboard;