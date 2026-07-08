'use client'
import React from 'react'

interface CalculatorModalProps {
  onClose: () => void
}

export default function CalculatorModal({ onClose }: CalculatorModalProps) {
  const [calc, setCalc] = React.useState('0')
  const [expression, setExpression] = React.useState('')

  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '−'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ]

  function handle(t: string) {
    if (t === 'C') { setCalc('0'); setExpression(''); return }
    if (t === '±') { setCalc(c => c.startsWith('-') ? c.slice(1) : '-' + c); return }
    if (t === '%') { setCalc(c => String(parseFloat(c) / 100)); return }
    if (t === '=') {
      try {
        const expr = expression + calc
        // eslint-disable-next-line no-eval
        const val = eval(expr.replace('×', '*').replace('÷', '/').replace('−', '-'))
        setExpression('')
        setCalc(String(parseFloat(val.toFixed(10))))
      } catch {
        setCalc('Error')
        setExpression('')
      }
      return
    }
    if (['+', '−', '×', '÷'].includes(t)) {
      setExpression(expression + calc + t)
      setCalc('0')
      return
    }
    if (t === '.') {
      if (!calc.includes('.')) setCalc(c => c + '.')
      return
    }
    setCalc(c => c === '0' ? t : c + t)
  }

  const isOp = (t: string) => ['+', '−', '×', '÷'].includes(t)
  const isEqual = (t: string) => t === '='

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-96 overflow-hidden" style={{ fontFamily: 'var(--font-sans, system-ui)' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <span className="text-sm font-semibold text-gray-700 tracking-wide uppercase" style={{ letterSpacing: '0.06em' }}>Calculator</span>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors text-lg">✕</button>
        </div>

        <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
          <div className="text-xs text-gray-400 text-right min-h-5 mb-1 font-mono">{expression || ' '}</div>
          <div className="text-3xl font-light text-right text-gray-900 font-mono tracking-tight truncate">{calc}</div>
        </div>

        <div className="p-4 grid gap-2">
          {buttons.map((row, ri) => (
            <div key={ri} className="grid gap-2" style={{ gridTemplateColumns: ri === 4 ? '2fr 1fr 1fr' : 'repeat(4, 1fr)' }}>
              {row.map((t) => (
                <button
                  key={t}
                  onClick={() => handle(t)}
                  className={
                    `h-14 rounded-xl text-base font-medium transition-all active:scale-95
                    ${t === 'C' || t === '±' || t === '%' ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : ''}
                    ${isOp(t) ? 'text-white hover:opacity-90' : ''}
                    ${isEqual(t) ? 'text-white hover:opacity-90' : ''}
                    ${!isOp(t) && !isEqual(t) && t !== 'C' && t !== '±' && t !== '%' ? 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50' : ''}`
                  }
                  style={isOp(t) || isEqual(t) ? { backgroundColor: '#1a6b45' } : undefined}
                >
                  {t}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
