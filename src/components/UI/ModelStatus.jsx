import React from 'react';
import { useChatContext } from '../../context/ChatContext';
import { Activity, Check, X, Sparkles } from 'lucide-react';

const ModelStatus = () => {
  const { currentModel, modelPerformance, triedModels } = useChatContext();

  if (!currentModel) return null;

  const stats = modelPerformance[currentModel];
  const successRate = stats ? Math.round(stats.successRate) : null;
  const modelName = currentModel.split('/').pop() || currentModel;

  return (
    <div className="flex items-center gap-2 text-xs bg-gray-100 rounded-full px-3 py-1">
      <Sparkles size={12} className="text-primary-500" />
      <span className="text-gray-700 font-medium">{modelName}</span>
      {successRate !== null && (
        <span className={`flex items-center gap-1 ${
          successRate > 80 ? 'text-green-600' :
          successRate > 50 ? 'text-yellow-600' :
          'text-red-600'
        }`}>
          {successRate > 80 ? <Check size={10} /> : <X size={10} />}
          {successRate}%
        </span>
      )}
      {triedModels && triedModels.length > 1 && (
        <span className="text-gray-400">
          • {triedModels.length} tried
        </span>
      )}
    </div>
  );
};

export default ModelStatus;