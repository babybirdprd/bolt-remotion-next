"use client"

import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { HexColorPicker } from 'react-colorful';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="w-full h-10 rounded-md border border-input"
          style={{ backgroundColor: color }}
        />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <HexColorPicker color={color} onChange={onChange} />
      </PopoverContent>
    </Popover>
  );
};