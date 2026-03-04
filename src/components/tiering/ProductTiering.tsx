'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, 
  Star, 
  Zap, 
  Shield, 
  Rocket, 
  Gem, 
  Diamond, 
  Trophy, 
  Award, 
  Target, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  TrendingUp, 
  Users, 
  Home, 
  Activity, 
  Heart, 
  BarChart3, 
  FileText, 
  Smartphone, 
  Cloud, 
  Database, 
  Lock, 
  Unlock, 
  Key, 
  CreditCard, 
  DollarSign, 
  Package, 
  Settings, 
  RefreshCw,
  Download,
  Upload,
  Eye,
  EyeOff,
  Filter,
  Search,
  Bell,
  Mail,
  Phone,
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Edit,
  Trash2,
  Save,
  DownloadCloud,
  UploadCloud,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  Battery,
  Signal,
  Globe,
  MapPin,
  Navigation,
  Compass,
  Route,
  Map,
  Layers,
  Grid,
  List,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Send,
  Share2,
  Link,
  Link2,
  ExternalLink,
  HelpCircle,
  QuestionMark,
  Lightbulb,
  Bulb,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Thermometer,
  Gauge,
  Speed,
  Timer,
  Stopwatch,
  AlarmClock,
  Clock1,
  Clock2,
  Clock3,
  Clock4,
  Clock5,
  Clock6,
  Clock7,
  Clock8,
  Clock9,
  Clock10,
  Clock11,
  Clock12
} from 'lucide-react';

// Import types
import { Resident } from '@/types/presence';
import type { 
  VitalSignsReading, 
  BreathingPattern, 
  SleepSession, 
  VitalSignsAlert 
} from '@/types/vitalSigns';
import type { 
  FallEvent, 
  ImmobilityAlert, 
  FallRiskAssessment 
} from '@/types/fallDetection';

interface ProductTier {
  id: string;
  name: string;
  displayName: string;
  description: string;
  price: {
    monthly: number;
    annual: number;
    currency: string;
    billingCycle: 'monthly' | 'annual';
  };
  features: {
    core: Feature[];
    advanced: Feature[];
    premium: Feature[];
  };
  limitations: {
    residents: number;
    caregivers: number;
    facilities: number;
    storage: number;
    apiCalls: number;
    dataRetention: number;
    supportLevel: 'basic' | 'priority' | 'premium' | 'enterprise';
  };
  icon: React.ReactNode;
  color: string;
  badge: string;
  popular?: boolean;
  enterprise?: boolean;
}

interface Feature {
  id: string;
  name: string;
  description: string;
  category: 'monitoring' | 'analytics' | 'communication' | 'integration' | 'support' | 'security' | 'storage' | 'api';
  tier: 'basic' | 'plus' | 'pro' | 'enterprise';
  included: boolean;
  highlighted?: boolean;
  icon: React.ReactNode;
  details?: string[];
}

interface Subscription {
  id: string;
  tierId: string;
  customerId: string;
  customerName: string;
  status: 'active' | 'trialing' | 'expired' | 'cancelled' | 'suspended';
  startDate: Date;
  endDate: Date;
  nextBillingDate: Date;
  billingCycle: 'monthly' | 'annual';
  price: number;
  currency: string;
  autoRenew: boolean;
  paymentMethod: string;
  usage: {
    residents: number;
    caregivers: number;
    facilities: number;
    storage: number;
    apiCalls: number;
  };
  features: string[];
}

interface ProductTieringProps {
  residents: Resident[];
  vitalSignsReadings: VitalSignsReading[];
  breathingPatterns: BreathingPattern[];
  sleepSessions: SleepSession[];
  vitalSignsAlerts: VitalSignsAlert[];
  fallEvents: FallEvent[];
  immobilityAlerts: ImmobilityAlert[];
  riskAssessments: FallRiskAssessment[];
}

const ProductTiering: React.FC<ProductTieringProps> = ({
  residents,
  vitalSignsReadings,
  breathingPatterns,
  sleepSessions,
  vitalSignsAlerts,
  fallEvents,
  immobilityAlerts,
  riskAssessments
}) => {
  const [selectedTier, setSelectedTier] = useState<string>('plus');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [showComparison, setShowComparison] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Product tiers definition
  const productTiers: ProductTier[] = useMemo(() => [
    {
      id: 'basic',
      name: 'basic',
      displayName: 'Basic',
      description: 'Essential monitoring for small facilities',
      price: {
        monthly: 49,
        annual: 490,
        currency: 'USD',
        billingCycle: 'annual'
      },
      features: {
        core: [
          { id: 'presence', name: 'Real-time Presence Detection', description: 'Monitor resident presence in real-time', category: 'monitoring', tier: 'basic', included: true, icon: <Users className="w-4 h-4" /> },
          { id: 'fall', name: 'Fall Detection', description: 'AI-powered fall detection and alerts', category: 'monitoring', tier: 'basic', included: true, icon: <Shield className="w-4 h-4" /> },
          { id: 'alerts', name: 'Smart Alerts', description: 'Configurable alert system', category: 'communication', tier: 'basic', included: true, icon: <Bell className="w-4 h-4" /> },
          { id: 'dashboard', name: 'Basic Dashboard', description: 'Simple monitoring dashboard', category: 'analytics', tier: 'basic', included: true, icon: <BarChart3 className="w-4 h-4" /> }
        ],
        advanced: [],
        premium: []
      },
      limitations: {
        residents: 1,
        caregivers: 2,
        facilities: 1,
        storage: 10,
        apiCalls: 1000,
        dataRetention: 30,
        supportLevel: 'basic'
      },
      icon: <Package className="w-6 h-6" />,
      color: 'blue',
      badge: 'Starter'
    },
    {
      id: 'plus',
      name: 'plus',
      displayName: 'Plus',
      description: 'Advanced monitoring with AI insights',
      price: {
        monthly: 99,
        annual: 990,
        currency: 'USD',
        billingCycle: 'annual'
      },
      features: {
        core: [
          { id: 'presence', name: 'Real-time Presence Detection', description: 'Monitor resident presence in real-time', category: 'monitoring', tier: 'plus', included: true, icon: <Users className="w-4 h-4" /> },
          { id: 'fall', name: 'Fall Detection', description: 'AI-powered fall detection and alerts', category: 'monitoring', tier: 'plus', included: true, icon: <Shield className="w-4 h-4" /> },
          { id: 'alerts', name: 'Smart Alerts', description: 'Configurable alert system', category: 'communication', tier: 'plus', included: true, icon: <Bell className="w-4 h-4" /> },
          { id: 'dashboard', name: 'Advanced Dashboard', description: 'Comprehensive monitoring dashboard', category: 'analytics', tier: 'plus', included: true, icon: <BarChart3 className="w-4 h-4" /> }
        ],
        advanced: [
          { id: 'vitals', name: 'Vital Signs Monitoring', description: 'Track breathing rate and vital signs', category: 'monitoring', tier: 'plus', included: true, icon: <Heart className="w-4 h-4" />, highlighted: true },
          { id: 'sleep', name: 'Sleep Analytics', description: 'Monitor sleep patterns and quality', category: 'analytics', tier: 'plus', included: true, icon: <Moon className="w-4 h-4" /> },
          { id: 'timeline', name: 'Activity Timeline', description: 'Complete activity history and patterns', category: 'analytics', tier: 'plus', included: true, icon: <Clock className="w-4 h-4" /> },
          { id: 'ai', name: 'AI Anomaly Detection', description: 'Machine learning-powered anomaly detection', category: 'analytics', tier: 'plus', included: true, icon: <Zap className="w-4 h-4" />, highlighted: true }
        ],
        premium: []
      },
      limitations: {
        residents: 5,
        caregivers: 10,
        facilities: 3,
        storage: 100,
        apiCalls: 10000,
        dataRetention: 90,
        supportLevel: 'priority'
      },
      icon: <Star className="w-6 h-6" />,
      color: 'purple',
      badge: 'Popular',
      popular: true
    },
    {
      id: 'pro',
      name: 'pro',
      displayName: 'Pro',
      description: 'Professional-grade monitoring with full features',
      price: {
        monthly: 199,
        annual: 1990,
        currency: 'USD',
        billingCycle: 'annual'
      },
      features: {
        core: [
          { id: 'presence', name: 'Real-time Presence Detection', description: 'Monitor resident presence in real-time', category: 'monitoring', tier: 'pro', included: true, icon: <Users className="w-4 h-4" /> },
          { id: 'fall', name: 'Advanced Fall Detection', description: 'AI-powered fall detection with prevention', category: 'monitoring', tier: 'pro', included: true, icon: <Shield className="w-4 h-4" /> },
          { id: 'alerts', name: 'Smart Alerts', description: 'Configurable alert system with escalation', category: 'communication', tier: 'pro', included: true, icon: <Bell className="w-4 h-4" /> },
          { id: 'dashboard', name: 'Professional Dashboard', description: 'Full-featured monitoring dashboard', category: 'analytics', tier: 'pro', included: true, icon: <BarChart3 className="w-4 h-4" /> }
        ],
        advanced: [
          { id: 'vitals', name: 'Comprehensive Vital Signs', description: 'Complete vital signs monitoring and analysis', category: 'monitoring', tier: 'pro', included: true, icon: <Heart className="w-4 h-4" /> },
          { id: 'sleep', name: 'Advanced Sleep Analytics', description: 'Detailed sleep pattern analysis', category: 'analytics', tier: 'pro', included: true, icon: <Moon className="w-4 h-4" /> },
          { id: 'timeline', name: 'Activity Timeline', description: 'Complete activity history and patterns', category: 'analytics', tier: 'pro', included: true, icon: <Clock className="w-4 h-4" /> },
          { id: 'ai', name: 'Advanced AI Analytics', description: 'Machine learning-powered insights and predictions', category: 'analytics', tier: 'pro', included: true, icon: <Zap className="w-4 h-4" /> },
          { id: 'rooms', name: 'Room-Level Motion Zones', description: 'Detailed room monitoring and motion zones', category: 'monitoring', tier: 'pro', included: true, icon: <Home className="w-4 h-4" /> },
          { id: 'caregivers', name: 'Caregiver Management', description: 'Complete caregiver team management', category: 'analytics', tier: 'pro', included: true, icon: <Users className="w-4 h-4" /> }
        ],
        premium: [
          { id: 'reports', name: 'Advanced Reports', description: 'Comprehensive reporting and analytics', category: 'analytics', tier: 'pro', included: true, icon: <FileText className="w-4 h-4" />, highlighted: true },
          { id: 'mobile', name: 'Mobile App Access', description: 'Full-featured mobile app for all platforms', category: 'communication', tier: 'pro', included: true, icon: <Smartphone className="w-4 h-4" />, highlighted: true },
          { id: 'api', name: 'API Access', description: 'RESTful API for integrations', category: 'integration', tier: 'pro', included: true, icon: <Globe className="w-4 h-4" /> },
          { id: 'integrations', name: 'Third-Party Integrations', description: 'Integration with popular healthcare systems', category: 'integration', tier: 'pro', included: true, icon: <Link2 className="w-4 h-4" /> }
        ]
      },
      limitations: {
        residents: 20,
        caregivers: 50,
        facilities: 10,
        storage: 1000,
        apiCalls: 100000,
        dataRetention: 365,
        supportLevel: 'premium'
      },
      icon: <Trophy className="w-6 h-6" />,
      color: 'gold',
      badge: 'Professional'
    },
    {
      id: 'enterprise',
      name: 'enterprise',
      displayName: 'Enterprise',
      description: 'Custom solutions for large organizations',
      price: {
        monthly: 499,
        annual: 4990,
        currency: 'USD',
        billingCycle: 'annual'
      },
      features: {
        core: [
          { id: 'presence', name: 'Enterprise Presence Detection', description: 'Advanced presence detection with analytics', category: 'monitoring', tier: 'enterprise', included: true, icon: <Users className="w-4 h-4" /> },
          { id: 'fall', name: 'Enterprise Fall Detection', description: 'Advanced fall detection with custom models', category: 'monitoring', tier: 'enterprise', included: true, icon: <Shield className="w-4 h-4" /> },
          { id: 'alerts', name: 'Enterprise Alerts', description: 'Advanced alert system with custom workflows', category: 'communication', tier: 'enterprise', included: true, icon: <Bell className="w-4 h-4" /> },
          { id: 'dashboard', name: 'Enterprise Dashboard', description: 'Customizable dashboard with white-label options', category: 'analytics', tier: 'enterprise', included: true, icon: <BarChart3 className="w-4 h-4" /> }
        ],
        advanced: [
          { id: 'vitals', name: 'Enterprise Vital Signs', description: 'Complete vital signs monitoring with custom analytics', category: 'monitoring', tier: 'enterprise', included: true, icon: <Heart className="w-4 h-4" /> },
          { id: 'sleep', name: 'Enterprise Sleep Analytics', description: 'Advanced sleep analysis with custom reporting', category: 'analytics', tier: 'enterprise', included: true, icon: <Moon className="w-4 h-4" /> },
          { id: 'timeline', name: 'Enterprise Timeline', description: 'Complete activity timeline with custom filters', category: 'analytics', tier: 'enterprise', included: true, icon: <Clock className="w-4 h-4" /> },
          { id: 'ai', name: 'Enterprise AI Analytics', description: 'Custom AI models and advanced analytics', category: 'analytics', tier: 'enterprise', included: true, icon: <Zap className="w-4 h-4" /> },
          { id: 'rooms', name: 'Enterprise Room Monitoring', description: 'Advanced room monitoring with custom zones', category: 'monitoring', tier: 'enterprise', included: true, icon: <Home className="w-4 h-4" /> },
          { id: 'caregivers', name: 'Enterprise Caregiver Management', description: 'Advanced caregiver management with custom workflows', category: 'analytics', tier: 'enterprise', included: true, icon: <Users className="w-4 h-4" /> },
          { id: 'compliance', name: 'Compliance & Reporting', description: 'Advanced compliance reporting and audit trails', category: 'analytics', tier: 'enterprise', included: true, icon: <FileText className="w-4 h-4" /> }
        ],
        premium: [
          { id: 'reports', name: 'Enterprise Reports', description: 'Custom reporting with white-label options', category: 'analytics', tier: 'enterprise', included: true, icon: <FileText className="w-4 h-4" /> },
          { id: 'mobile', name: 'Enterprise Mobile App', description: 'Custom mobile app with white-label options', category: 'communication', tier: 'enterprise', included: true, icon: <Smartphone className="w-4 h-4" /> },
          { id: 'api', name: 'Enterprise API', description: 'Advanced API with custom endpoints', category: 'integration', tier: 'enterprise', included: true, icon: <Globe className="w-4 h-4" /> },
          { id: 'integrations', name: 'Enterprise Integrations', description: 'Custom integrations with dedicated support', category: 'integration', tier: 'enterprise', included: true, icon: <Link2 className="w-4 h-4" /> },
          { id: 'concierge', name: 'Emergency Concierge', description: '24/7 emergency response service', category: 'support', tier: 'enterprise', included: true, icon: <Phone className="w-4 h-4" />, highlighted: true },
          { id: 'white-label', name: 'White-Label Solution', description: 'Complete white-label customization', category: 'support', tier: 'enterprise', included: true, icon: <Award className="w-4 h-4" />, highlighted: true },
          { id: 'dedicated', name: 'Dedicated Infrastructure', description: 'Dedicated cloud infrastructure', category: 'support', tier: 'enterprise', included: true, icon: <Server className="w-4 h-4" /> },
          { id: 'sla', name: 'Enterprise SLA', description: '99.9% uptime guarantee with SLA', category: 'support', tier: 'enterprise', included: true, icon: <Shield className="w-4 h-4" /> }
        ]
      },
      limitations: {
        residents: -1,
        caregivers: -1,
        facilities: -1,
        storage: -1,
        apiCalls: -1,
        dataRetention: -1,
        supportLevel: 'enterprise'
      },
      icon: <Crown className="w-6 h-6" />,
      color: 'red',
      badge: 'Enterprise',
      enterprise: true
    }
  ], []);

  // Generate mock subscriptions
  const subscriptions: Subscription[] = useMemo(() => [
    {
      id: 'sub-1',
      tierId: 'basic',
      customerId: 'cust-1',
      customerName: 'Sunshine Care Home',
      status: 'active',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2025-01-15'),
      nextBillingDate: new Date('2025-01-15'),
      billingCycle: 'annual',
      price: 490,
      currency: 'USD',
      autoRenew: true,
      paymentMethod: 'credit_card',
      usage: {
        residents: 1,
        caregivers: 2,
        facilities: 1,
        storage: 8,
        apiCalls: 850
      },
      features: ['presence', 'fall', 'alerts', 'dashboard']
    },
    {
      id: 'sub-2',
      tierId: 'plus',
      customerId: 'cust-2',
      customerName: 'Golden Years Residence',
      status: 'active',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2025-02-01'),
      nextBillingDate: new Date('2025-02-01'),
      billingCycle: 'annual',
      price: 990,
      currency: 'USD',
      autoRenew: true,
      paymentMethod: 'bank_transfer',
      usage: {
        residents: 4,
        caregivers: 8,
        facilities: 2,
        storage: 75,
        apiCalls: 8500
      },
      features: ['presence', 'fall', 'alerts', 'dashboard', 'vitals', 'sleep', 'timeline', 'ai']
    },
    {
      id: 'sub-3',
      tierId: 'pro',
      customerId: 'cust-3',
      customerName: 'Heritage Care Center',
      status: 'active',
      startDate: new Date('2023-12-01'),
      endDate: new Date('2024-12-01'),
      nextBillingDate: new Date('2024-12-01'),
      billingCycle: 'annual',
      price: 1990,
      currency: 'USD',
      autoRenew: true,
      paymentMethod: 'credit_card',
      usage: {
        residents: 15,
        caregivers: 35,
        facilities: 6,
        storage: 650,
        apiCalls: 75000
      },
      features: ['presence', 'fall', 'alerts', 'dashboard', 'vitals', 'sleep', 'timeline', 'ai', 'rooms', 'caregivers', 'reports', 'mobile', 'api', 'integrations']
    },
    {
      id: 'sub-4',
      tierId: 'enterprise',
      customerId: 'cust-4',
      customerName: 'ElderCare Network',
      status: 'active',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2025-01-01'),
      nextBillingDate: new Date('2025-01-01'),
      billingCycle: 'annual',
      price: 4990,
      currency: 'USD',
      autoRenew: true,
      paymentMethod: 'wire_transfer',
      usage: {
        residents: 45,
        caregivers: 120,
        facilities: 15,
        storage: 2500,
        apiCalls: 250000
      },
      features: ['presence', 'fall', 'alerts', 'dashboard', 'vitals', 'sleep', 'timeline', 'ai', 'rooms', 'caregivers', 'reports', 'mobile', 'api', 'integrations', 'concierge', 'white-label', 'dedicated', 'sla']
    },
    {
      id: 'sub-5',
      tierId: 'plus',
      customerId: 'cust-5',
      customerName: 'Comfort Living Assisted',
      status: 'trialing',
      startDate: new Date('2024-10-15'),
      endDate: new Date('2024-11-15'),
      nextBillingDate: new Date('2024-11-15'),
      billingCycle: 'monthly',
      price: 99,
      currency: 'USD',
      autoRenew: false,
      paymentMethod: 'credit_card',
      usage: {
        residents: 2,
        caregivers: 5,
        facilities: 1,
        storage: 25,
        apiCalls: 1500
      },
      features: ['presence', 'fall', 'alerts', 'dashboard', 'vitals', 'sleep', 'timeline', 'ai']
    }
  ], []);

  // Filter features based on selected category
  const allFeatures = useMemo(() => {
    const features: Feature[] = [];
    productTiers.forEach(tier => {
      [...tier.features.core, ...tier.features.advanced, ...tier.features.premium].forEach(feature => {
        if (!features.find(f => f.id === feature.id)) {
          features.push(feature);
        }
      });
    });
    return features;
  }, [productTiers]);

  const filteredFeatures = useMemo(() => {
    if (selectedCategory === 'all') return allFeatures;
    return allFeatures.filter(feature => feature.category === selectedCategory);
  }, [allFeatures, selectedCategory]);

  const selectedTierData = productTiers.find(tier => tier.id === selectedTier);

  const getAnnualDiscount = (tier: ProductTier) => {
    const monthlyTotal = tier.price.monthly * 12;
    const discount = ((monthlyTotal - tier.price.annual) / monthlyTotal) * 100;
    return Math.round(discount);
  };

  const getTierColor = (tier: string) => {
    const tierData = productTiers.find(t => t.id === tier);
    return tierData?.color || 'gray';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'trialing': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'monitoring': return <Activity className="w-4 h-4" />;
      case 'analytics': return <BarChart3 className="w-4 h-4" />;
      case 'communication': return <MessageSquare className="w-4 h-4" />;
      case 'integration': return <Link2 className="w-4 h-4" />;
      case 'support': return <HelpCircle className="w-4 h-4" />;
      case 'security': return <Shield className="w-4 h-4" />;
      case 'storage': return <Database className="w-4 h-4" />;
      case 'api': return <Globe className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const handleSubscribe = (tierId: string) => {
    console.log('Subscribing to tier:', tierId);
    setShowSubscriptionModal(true);
  };

  const handleUpgrade = (subscriptionId: string, newTierId: string) => {
    console.log('Upgrading subscription:', subscriptionId, 'to tier:', newTierId);
  };

  const handleCancel = (subscriptionId: string) => {
    console.log('Cancelling subscription:', subscriptionId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5" />
              <span>Product Tiers & Feature Matrix</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Pricing
              </Button>
              <Button variant="outline">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'font-medium' : 'text-gray-600'}`}>
              Monthly
            </span>
            <Switch
              checked={billingCycle === 'annual'}
              onCheckedChange={(checked) => setBillingCycle(checked ? 'annual' : 'monthly')}
            />
            <span className={`text-sm ${billingCycle === 'annual' ? 'font-medium' : 'text-gray-600'}`}>
              Annual
              <Badge variant="secondary" className="ml-2">
                Save 17%
              </Badge>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Product Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {productTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative ${tier.popular ? 'ring-2 ring-blue-500' : ''}`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <Card className={`h-full ${tier.enterprise ? 'border-red-200' : ''}`}>
                <CardHeader className="text-center pb-4">
                  <div className={`inline-flex p-3 rounded-full ${tier.color === 'blue' ? 'bg-blue-100' : tier.color === 'purple' ? 'bg-purple-100' : tier.color === 'gold' ? 'bg-yellow-100' : tier.color === 'red' ? 'bg-red-100' : 'bg-gray-100'} mb-4`}>
                    {tier.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{tier.displayName}</h3>
                  <p className="text-gray-600 text-sm mb-4">{tier.description}</p>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <span className="text-3xl font-bold">
                        ${billingCycle === 'annual' ? tier.price.annual / 12 : tier.price.monthly}
                      </span>
                      <span className="text-gray-600">/mo</span>
                    </div>
                    {billingCycle === 'annual' && (
                      <p className="text-sm text-green-600 mt-1">
                        ${tier.price.annual} billed annually
                        <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Save {getAnnualDiscount(tier)}%
                        </span>
                      </p>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Core Features */}
                    <div>
                      <h4 className="font-medium mb-2">Core Features</h4>
                      <div className="space-y-2">
                        {tier.features.core.map((feature) => (
                          <div key={feature.id} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm">{feature.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Advanced Features */}
                    {tier.features.advanced.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Advanced Features</h4>
                        <div className="space-y-2">
                          {tier.features.advanced.map((feature) => (
                            <div key={feature.id} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className={`text-sm ${feature.highlighted ? 'font-medium text-blue-600' : ''}`}>
                                {feature.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Premium Features */}
                    {tier.features.premium.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Premium Features</h4>
                        <div className="space-y-2">
                          {tier.features.premium.map((feature) => (
                            <div key={feature.id} className="flex items-center space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-500" />
                              <span className={`text-sm ${feature.highlighted ? 'font-medium text-purple-600' : ''}`}>
                                {feature.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Limitations */}
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Limits</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Residents:</span>
                          <span className="font-medium">
                            {tier.limitations.residents === -1 ? 'Unlimited' : tier.limitations.residents}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Caregivers:</span>
                          <span className="font-medium">
                            {tier.limitations.caregivers === -1 ? 'Unlimited' : tier.limitations.caregivers}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Facilities:</span>
                          <span className="font-medium">
                            {tier.limitations.facilities === -1 ? 'Unlimited' : tier.limitations.facilities}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Storage:</span>
                          <span className="font-medium">
                            {tier.limitations.storage === -1 ? 'Unlimited' : `${tier.limitations.storage}GB`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Button
                      className={`w-full mt-6 ${tier.popular ? 'bg-blue-600 hover:bg-blue-700' : tier.enterprise ? 'bg-red-600 hover:bg-red-700' : ''}`}
                      onClick={() => handleSubscribe(tier.id)}
                    >
                      {tier.enterprise ? 'Contact Sales' : 'Get Started'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Feature Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Feature Comparison</span>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                  <SelectItem value="analytics">Analytics</SelectItem>
                  <SelectItem value="communication">Communication</SelectItem>
                  <SelectItem value="integration">Integration</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="storage">Storage</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Feature</th>
                  {productTiers.map((tier) => (
                    <th key={tier.id} className="text-center p-3">
                      <div className="flex items-center justify-center space-x-2">
                        {tier.icon}
                        <span>{tier.displayName}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredFeatures.map((feature, index) => (
                  <tr key={feature.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(feature.category)}
                        <div>
                          <p className="font-medium">{feature.name}</p>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    </td>
                    {productTiers.map((tier) => {
                      const isIncluded = [...tier.features.core, ...tier.features.advanced, ...tier.features.premium]
                        .some(f => f.id === feature.id);
                      return (
                        <td key={tier.id} className="text-center p-3">
                          {isIncluded ? (
                            <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                          ) : (
                            <XCircle className="w-5 h-5 text-gray-300 mx-auto" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Subscription Management</span>
              <Badge variant="secondary">{subscriptions.length} active</Badge>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Subscription
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscriptions.map((subscription) => {
              const tier = productTiers.find(t => t.id === subscription.tierId);
              return (
                <motion.div
                  key={subscription.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-full ${getStatusColor(subscription.status)}`}>
                        {subscription.status === 'active' ? <CheckCircle className="w-4 h-4" /> :
                         subscription.status === 'trialing' ? <Clock className="w-4 h-4" /> :
                         subscription.status === 'expired' ? <XCircle className="w-4 h-4" /> :
                         <AlertCircle className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold">{subscription.customerName}</h3>
                          <Badge variant="outline" className="text-xs">
                            {tier?.displayName}
                          </Badge>
                          <Badge className={getStatusColor(subscription.status)} className="text-xs">
                            {subscription.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-sm">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span>Started: {subscription.startDate.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span>Next billing: {subscription.nextBillingDate.toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-sm">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              <span>${subscription.price}/{subscription.billingCycle}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <RefreshCw className="w-4 h-4 text-gray-400" />
                              <span>Auto-renew: {subscription.autoRenew ? 'Yes' : 'No'}</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-sm">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span>{subscription.usage.residents} residents</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Activity className="w-4 h-4 text-gray-400" />
                              <span>{subscription.usage.caregivers} caregivers</span>
                            </div>
                          </div>
                        </div>

                        {/* Usage Progress */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Storage Usage</span>
                            <span className="font-medium">
                              {subscription.usage.storage}GB / {tier?.limitations.storage === -1 ? '∞' : tier?.limitations.storage}GB
                            </span>
                          </div>
                          <Progress 
                            value={tier?.limitations.storage === -1 ? 50 : (subscription.usage.storage / tier.limitations.storage) * 100} 
                            className="h-2" 
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col space-y-2">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Manage
                        </Button>
                      </div>
                      {subscription.status === 'trialing' && (
                        <Button
                          className="w-full"
                          onClick={() => handleUpgrade(subscription.id, subscription.tierId)}
                        >
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Upgrade Plan
                        </Button>
                      )}
                      {subscription.status === 'active' && (
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => handleCancel(subscription.id)}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancel Subscription
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductTiering;