import React from 'react';
import { Sparkles } from 'lucide-react';

const FreeModelBadge = () => {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-medium">
      <Sparkles size={10} />
      Free
    </span>
  );
};

export default FreeModelBadge;