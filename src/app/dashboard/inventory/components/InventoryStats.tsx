interface Props {
  products: Array<{ currentStock: number; minStockLevel: number }>;
}

export function InventoryStats({ products }: Props) {
  const lowCount = products.filter((product) => product.currentStock > 0 && product.currentStock <= product.minStockLevel).length;
  const outCount = products.filter((product) => product.currentStock === 0).length;
  const totalStock = products.reduce((sum, product) => sum + product.currentStock, 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: 'Products', value: products.length, icon: '📦', color: 'text-gray-900' },
        { label: 'Total Stock', value: totalStock, icon: '📊', color: 'text-green-700' },
        { label: 'Low Stock', value: lowCount, icon: '⚠️', color: 'text-amber-600' },
        { label: 'Out of Stock', value: outCount, icon: '🔴', color: 'text-red-500' },
      ].map((card) => (
        <div key={card.label} className="bg-white rounded-xl border border-gray-100 px-4 py-3">
          <div className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">{card.label}</div>
          <div className={`text-xl font-semibold ${card.color}`}>{card.icon} {card.value}</div>
        </div>
      ))}
    </div>
  );
}
