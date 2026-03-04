'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Bed, 
  Bath, 
  Sofa, 
  Utensils, 
  DoorOpen, 
  User, 
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Room, Resident } from '@/types/presence';

interface RoomVisualizationProps {
  rooms: Room[];
  residents: Resident[];
  onRoomClick?: (room: Room) => void;
}

const RoomVisualization: React.FC<RoomVisualizationProps> = ({ 
  rooms, 
  residents, 
  onRoomClick 
}) => {
  const getRoomIcon = (type: Room['type']) => {
    switch (type) {
      case 'bedroom':
        return <Bed className="w-4 h-4" />;
      case 'bathroom':
        return <Bath className="w-4 h-4" />;
      case 'living_room':
        return <Sofa className="w-4 h-4" />;
      case 'kitchen':
        return <Utensils className="w-4 h-4" />;
      case 'hallway':
        return <DoorOpen className="w-4 h-4" />;
      default:
        return <DoorOpen className="w-4 h-4" />;
    }
  };

  const getOccupancyColor = (room: Room) => {
    const occupancyRatio = room.currentOccupancy / room.maxOccupancy;
    
    if (occupancyRatio === 0) return 'bg-gray-100 border-gray-300';
    if (occupancyRatio < 0.3) return 'bg-green-50 border-green-300';
    if (occupancyRatio < 0.6) return 'bg-yellow-50 border-yellow-300';
    if (occupancyRatio < 0.9) return 'bg-orange-50 border-orange-300';
    return 'bg-red-50 border-red-300';
  };

  const getOccupancyBadgeVariant = (room: Room) => {
    const occupancyRatio = room.currentOccupancy / room.maxOccupancy;
    
    if (occupancyRatio === 0) return 'secondary';
    if (occupancyRatio < 0.3) return 'default';
    if (occupancyRatio < 0.6) return 'secondary';
    if (occupancyRatio < 0.9) return 'destructive';
    return 'destructive';
  };

  const getResidentsInRoom = (roomId: string) => {
    return residents.filter(resident => resident.roomId === roomId);
  };

  const getResidentStatusColor = (status: Resident['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'resting':
        return 'text-blue-600 bg-blue-100';
      case 'sleeping':
        return 'text-purple-600 bg-purple-100';
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      case 'alert':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskLevelIcon = (riskLevel: Resident['riskLevel']) => {
    switch (riskLevel) {
      case 'normal':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'caution':
        return <AlertTriangle className="w-3 h-3 text-yellow-500" />;
      case 'warning':
        return <AlertTriangle className="w-3 h-3 text-orange-500" />;
      case 'critical':
        return <AlertTriangle className="w-3 h-3 text-red-500" />;
      default:
        return null;
    }
  };

  const formatLastOccupied = (date?: Date) => {
    if (!date) return 'Never';
    
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rooms.map((room) => {
        const roomResidents = getResidentsInRoom(room.id);
        const isOccupied = room.currentOccupancy > 0;
        
        return (
          <motion.div
            key={room.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onRoomClick?.(room)}
            className="cursor-pointer"
          >
            <Card className={`transition-all duration-300 ${getOccupancyColor(room)} ${
              isOccupied ? 'shadow-lg' : 'shadow-sm'
            }`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getRoomIcon(room.type)}
                    <CardTitle className="text-lg font-semibold">
                      {room.name}
                    </CardTitle>
                  </div>
                  <Badge variant={getOccupancyBadgeVariant(room)}>
                    {room.currentOccupancy}/{room.maxOccupancy}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {/* Occupancy Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {isOccupied ? 'Occupied' : 'Vacant'}
                    </span>
                  </div>
                  {isOccupied && (
                    <div className="flex items-center space-x-1">
                      <Activity className="w-3 h-3 text-green-500 animate-pulse" />
                      <span className="text-xs text-green-600">Active</span>
                    </div>
                  )}
                </div>

                {/* Residents in Room */}
                {roomResidents.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-gray-700">
                      Residents Present:
                    </div>
                    <div className="space-y-1">
                      {roomResidents.map((resident) => (
                        <div 
                          key={resident.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-white/50"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              {getRiskLevelIcon(resident.riskLevel)}
                              <span className="text-sm font-medium">
                                {resident.name}
                              </span>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${getResidentStatusColor(resident.status)}`}
                            >
                              {resident.status}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-500">
                            {resident.movementLevel}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Room Info */}
                <div className="space-y-1 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Sensors:</span>
                    <span>{room.sensors.length} active</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last occupied:</span>
                    <span>{formatLastOccupied(room.lastOccupied)}</span>
                  </div>
                  {room.lastOccupied && (
                    <div className="flex justify-between">
                      <span>Occupancy rate:</span>
                      <span>
                        {Math.round((room.currentOccupancy / room.maxOccupancy) * 100)}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Movement Indicator */}
                {isOccupied && (
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-600">
                        Real-time detection active
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default RoomVisualization;