'use client';

import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DollarSign, Clock, GripVertical, Plus, Minus } from 'lucide-react';

interface AllocationItem {
  id: string;
  name: string;
  budgetAmount: number;
  timeAmount: number;
  maxBudget?: number;
  maxTime?: number;
  color: string;
}

interface BudgetTimeAllocatorProps {
  totalBudget: number;
  totalTime: number;
  allocations: AllocationItem[];
  onAllocationsChange: (allocations: AllocationItem[]) => void;
  remainingBudget: number;
  remainingTime: number;
}

function DraggableAllocationItem({ 
  item, 
  onBudgetChange, 
  onTimeChange 
}: { 
  item: AllocationItem;
  onBudgetChange: (id: string, amount: number) => void;
  onTimeChange: (id: string, amount: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const adjustBudget = (delta: number) => {
    const newAmount = Math.max(0, item.budgetAmount + delta);
    onBudgetChange(item.id, newAmount);
  };

  const adjustTime = (delta: number) => {
    const newAmount = Math.max(0, item.timeAmount + delta);
    onTimeChange(item.id, newAmount);
  };

  return (
    <Card ref={setNodeRef} style={style} className="relative">
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      <CardHeader className="pb-3 pl-8">
        <CardTitle className="text-base flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: item.color }}
          />
          {item.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Budget Allocation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-1 text-sm">
              <DollarSign className="h-3 w-3" />
              Budget
            </Label>
            <Badge variant="outline">
              ${item.budgetAmount.toLocaleString()}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => adjustBudget(-10000)}
              disabled={item.budgetAmount <= 0}
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <div className="flex-1">
              <Input
                type="number"
                value={item.budgetAmount}
                onChange={(e) => onBudgetChange(item.id, parseInt(e.target.value) || 0)}
                className="text-center h-8"
                step="5000"
                min="0"
              />
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => adjustBudget(10000)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {item.maxBudget && (
            <Progress 
              value={(item.budgetAmount / item.maxBudget) * 100} 
              className="h-2"
            />
          )}
        </div>

        {/* Time Allocation */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-1 text-sm">
              <Clock className="h-3 w-3" />
              Time (hours)
            </Label>
            <Badge variant="outline">
              {item.timeAmount}h
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => adjustTime(-10)}
              disabled={item.timeAmount <= 0}
            >
              <Minus className="h-3 w-3" />
            </Button>
            
            <div className="flex-1">
              <Input
                type="number"
                value={item.timeAmount}
                onChange={(e) => onTimeChange(item.id, parseInt(e.target.value) || 0)}
                className="text-center h-8"
                step="5"
                min="0"
              />
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => adjustTime(10)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {item.maxTime && (
            <Progress 
              value={(item.timeAmount / item.maxTime) * 100} 
              className="h-2"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function BudgetTimeAllocator({
  totalBudget,
  totalTime,
  allocations,
  onAllocationsChange,
  remainingBudget,
  remainingTime
}: BudgetTimeAllocatorProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<AllocationItem | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    const item = allocations.find(a => a.id === event.active.id);
    setDraggedItem(item || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      const oldIndex = allocations.findIndex(item => item.id === active.id);
      const newIndex = allocations.findIndex(item => item.id === over?.id);
      
      const newAllocations = [...allocations];
      const [reorderedItem] = newAllocations.splice(oldIndex, 1);
      newAllocations.splice(newIndex, 0, reorderedItem);
      
      onAllocationsChange(newAllocations);
    }
    
    setActiveId(null);
    setDraggedItem(null);
  };

  const handleBudgetChange = (id: string, amount: number) => {
    const newAllocations = allocations.map(item =>
      item.id === id ? { ...item, budgetAmount: amount } : item
    );
    onAllocationsChange(newAllocations);
  };

  const handleTimeChange = (id: string, amount: number) => {
    const newAllocations = allocations.map(item =>
      item.id === id ? { ...item, timeAmount: amount } : item
    );
    onAllocationsChange(newAllocations);
  };

  const usedBudget = totalBudget - remainingBudget;
  const usedTime = totalTime - remainingTime;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Budget Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Used:</span>
                <span className="font-medium">${usedBudget.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Remaining:</span>
                <span className={`font-medium ${remainingBudget < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ${remainingBudget.toLocaleString()}
                </span>
              </div>
              <Progress 
                value={(usedBudget / totalBudget) * 100} 
                className="h-3"
              />
              <div className="text-xs text-muted-foreground text-center">
                {((usedBudget / totalBudget) * 100).toFixed(1)}% of total budget
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Time Allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Used:</span>
                <span className="font-medium">{usedTime}h</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Remaining:</span>
                <span className={`font-medium ${remainingTime < 0 ? 'text-red-600' : 'text-blue-600'}`}>
                  {remainingTime}h
                </span>
              </div>
              <Progress 
                value={(usedTime / totalTime) * 100} 
                className="h-3"
              />
              <div className="text-xs text-muted-foreground text-center">
                {((usedTime / totalTime) * 100).toFixed(1)}% of available time
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Allocation Items */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Drag to Reorder Priorities</h3>
        
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <SortableContext items={allocations.map(a => a.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {allocations.map((item) => (
                <DraggableAllocationItem
                  key={item.id}
                  item={item}
                  onBudgetChange={handleBudgetChange}
                  onTimeChange={handleTimeChange}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay>
            {draggedItem ? (
              <DraggableAllocationItem
                item={draggedItem}
                onBudgetChange={() => {}}
                onTimeChange={() => {}}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Warnings */}
      {(remainingBudget < 0 || remainingTime < 0) && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-red-700">
              <div className="font-medium">⚠️ Resource Overallocation</div>
            </div>
            <div className="text-sm text-red-600 mt-1">
              {remainingBudget < 0 && <div>Budget exceeded by ${Math.abs(remainingBudget).toLocaleString()}</div>}
              {remainingTime < 0 && <div>Time exceeded by {Math.abs(remainingTime)} hours</div>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
