'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Users, 
  Target, 
  Heart,
  GripVertical,
  X,
  Plus
} from 'lucide-react';
import { Tactic } from '@/lib/simMachine';

interface TacticCardProps {
  tactic: Tactic;
  onRemove?: () => void;
  onAdd?: () => void;
  isSelected?: boolean;
  isDraggable?: boolean;
  showAddButton?: boolean;
  showRemoveButton?: boolean;
}

export function TacticCard({ 
  tactic, 
  onRemove, 
  onAdd,
  isSelected = false,
  isDraggable = false,
  showAddButton = false,
  showRemoveButton = false
}: TacticCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: tactic.id,
    disabled: !isDraggable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getCategoryIcon = (category: Tactic['category']) => {
    switch (category) {
      case 'digital': return '💻';
      case 'traditional': return '📺';
      case 'content': return '📝';
      case 'events': return '🎪';
      case 'partnerships': return '🤝';
      default: return '📊';
    }
  };

  const getCategoryColor = (category: Tactic['category']) => {
    switch (category) {
      case 'digital': return 'bg-blue-100 text-blue-800';
      case 'traditional': return 'bg-gray-100 text-gray-800';
      case 'content': return 'bg-green-100 text-green-800';
      case 'events': return 'bg-purple-100 text-purple-800';
      case 'partnerships': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card 
      ref={setNodeRef}
      style={style}
      className={`relative transition-all duration-200 ${
        isSelected ? 'ring-2 ring-primary shadow-lg' : ''
      } ${isDragging ? 'shadow-2xl' : 'hover:shadow-md'}`}
    >
      {isDraggable && (
        <div 
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      )}

      {showRemoveButton && onRemove && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <CardHeader className={`pb-3 ${isDraggable ? 'pl-8' : ''}`}>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg leading-tight">{tactic.name}</CardTitle>
            <Badge className={getCategoryColor(tactic.category)}>
              {getCategoryIcon(tactic.category)} {tactic.category}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Cost and Time */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <div>
              <div className="text-sm font-medium">${tactic.cost.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Cost</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <div>
              <div className="text-sm font-medium">{tactic.timeRequired}h</div>
              <div className="text-xs text-muted-foreground">Time</div>
            </div>
          </div>
        </div>

        {/* Expected Impact */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Expected Impact</h4>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-xs">Revenue</span>
              </div>
              <span className="text-xs font-medium">
                +${tactic.expectedImpact.revenue.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-3 w-3 text-blue-600" />
                <span className="text-xs">Market Share</span>
              </div>
              <span className="text-xs font-medium">
                +{tactic.expectedImpact.marketShare}%
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="h-3 w-3 text-pink-600" />
                <span className="text-xs">Satisfaction</span>
              </div>
              <span className="text-xs font-medium">
                +{tactic.expectedImpact.customerSatisfaction}%
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-3 w-3 text-purple-600" />
                <span className="text-xs">Awareness</span>
              </div>
              <span className="text-xs font-medium">
                +{tactic.expectedImpact.brandAwareness}%
              </span>
            </div>
          </div>
        </div>

        {/* ROI Indicator */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">ROI Potential</span>
            <span className="text-xs font-medium">
              {((tactic.expectedImpact.revenue / tactic.cost) * 100).toFixed(0)}%
            </span>
          </div>
          <Progress 
            value={Math.min(((tactic.expectedImpact.revenue / tactic.cost) * 100) / 3, 100)} 
            className="h-2"
          />
        </div>

        {/* Action Button */}
        {showAddButton && onAdd && (
          <Button 
            onClick={onAdd}
            className="w-full mt-4"
            variant={isSelected ? "default" : "outline"}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isSelected ? 'Added to Plan' : 'Add to Plan'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Draggable wrapper for use in sortable contexts
export function DraggableTacticCard(props: TacticCardProps) {
  return <TacticCard {...props} isDraggable={true} />;
}
