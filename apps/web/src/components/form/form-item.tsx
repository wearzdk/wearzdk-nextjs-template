import { Label } from '@ui/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@ui/components/ui/tooltip';
import { cn } from '@ui/lib/utils';
import { HelpCircle } from 'lucide-react';
import type { ReactNode } from 'react';

interface FormItemProps {
  label: string;
  children: ReactNode;
  required?: boolean;
  optional?: boolean;
  help?: string;
  /** 帮助文本的显示方式 */
  helpDisplay?: 'icon' | 'text';
  className?: string;
}

export function FormItem({
  label,
  children,
  required,
  optional,
  help,
  helpDisplay = 'icon',
  className,
}: FormItemProps) {
  const renderHelp = () => {
    if (!help) return null;

    if (helpDisplay === 'icon') {
      return (
        <TooltipProvider>
          <Tooltip delayDuration={100}>
            <TooltipTrigger type="button">
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{help}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return <p className="text-xs text-muted-foreground mt-1">{help}</p>;
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1">
          <Label>{label}</Label>
          {helpDisplay === 'icon' && renderHelp()}
        </div>
        {(required || optional) && (
          <span
            className={cn(
              'text-xs',
              required ? 'text-red-500' : 'text-muted-foreground',
            )}
          >
            {required ? '必填' : '选填'}
          </span>
        )}
      </div>
      {children}
      {helpDisplay === 'text' && renderHelp()}
    </div>
  );
}
