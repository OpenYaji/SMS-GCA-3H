import { useState } from 'react';

// This helper function remains the same
const darkenColor = (hex, percent) => {
  let color = hex.startsWith('#') ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const Folder = ({ color = '#5227FF', size = 1, items = [], className = '' }) => {
  const maxItems = 3;
  const papers = items.slice(0, maxItems);
  while (papers.length < maxItems) {
    papers.push(null);
  }

  const [open, setOpen] = useState(false);
  const [paperOffsets, setPaperOffsets] = useState(Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })));

  const folderStyle = {
    '--folder-color': color,
    '--folder-back-color': darkenColor(color, 0.08),
    '--paper-1': darkenColor('#ffffff', 0.1),
    '--paper-2': darkenColor('#ffffff', 0.05),
    '--paper-3': '#ffffff',
  };

  const handleClick = () => {
    setOpen((prev) => !prev);
    if (open) {
      setPaperOffsets(Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })));
    }
  };
  
  const handlePaperMouseMove = (e, index) => {
    if (!open) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) * 0.15;
    const offsetY = (e.clientY - centerY) * 0.15;
    setPaperOffsets((prev) => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: offsetX, y: offsetY };
      return newOffsets;
    });
  };

  const handlePaperMouseLeave = (index) => {
    setPaperOffsets((prev) => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: 0, y: 0 };
      return newOffsets;
    });
  };
  
  const getOpenTransform = (index) => {
    if (index === 0) return 'translate(-120%, -70%) rotate(-15deg)';
    if (index === 1) return 'translate(10%, -70%) rotate(15deg)';
    if (index === 2) return 'translate(-50%, -100%) rotate(5deg)';
    return '';
  };

  return (
    <div style={{ transform: `scale(${size})` }} className={className}>
      <div
        className={`group relative cursor-pointer transition-all duration-200 ease-in ${
          !open ? 'hover:-translate-y-2' : ''
        }`}
        style={{
          ...folderStyle,
          transform: open ? 'translateY(-8px)' : undefined,
        }}
        onClick={handleClick}
      >
        <div
          className="relative h-[80px] w-[100px] rounded-bl-[10px] rounded-br-[10px] rounded-tr-[10px] bg-[var(--folder-back-color)]"
        >
          <span
            className="absolute bottom-[98%] left-0 h-[10px] w-[30px] rounded-tl-[5px] rounded-tr-[5px] bg-[var(--folder-back-color)]"
          ></span>

          {/* ✨ NAME LABEL REMOVED FROM INSIDE THE FOLDER ✨ */}

          {papers.map((item, i) => {
            const paperColorClasses = [
              'bg-[var(--paper-1)]',
              'bg-[var(--paper-2)]',
              'bg-[var(--paper-3)]',
            ];
            let sizeClasses = '';
            if (i === 0) sizeClasses = open ? 'h-[80%] w-[70%]' : 'h-[80%] w-[70%]';
            if (i === 1) sizeClasses = open ? 'h-[80%] w-[80%]' : 'h-[70%] w-[80%]';
            if (i === 2) sizeClasses = open ? 'h-[80%] w-[90%]' : 'h-[60%] w-[90%]';

            const transformStyle = open
              ? `${getOpenTransform(i)} translate(${paperOffsets[i].x}px, ${paperOffsets[i].y}px)`
              : undefined;

            return (
              <div
                key={i}
                onMouseMove={(e) => handlePaperMouseMove(e, i)}
                onMouseLeave={() => handlePaperMouseLeave(i)}
                className={`absolute bottom-[10%] left-1/2 z-20 transition-all duration-300 ease-in-out ${
                  !open ? 'translate-y-[10%] -translate-x-1/2 transform group-hover:translate-y-0' : 'hover:scale-110'
                } ${sizeClasses} ${paperColorClasses[i]}`}
                style={{
                  borderRadius: '10px',
                  ...(!open ? {} : { transform: transformStyle }),
                }}
              >
                {item}
              </div>
            );
          })}
          
          <div
            className={`absolute z-30 h-full w-full origin-bottom transition-all duration-300 ease-in-out bg-[var(--folder-color)] ${
              !open ? 'group-hover:[transform:skew(15deg)_scaleY(0.6)]' : ''
            }`}
            style={{
              borderRadius: '5px 10px 10px 10px',
              ...(open && { transform: 'skew(15deg) scaleY(0.6)' }),
            }}
          ></div>

          <div
            className={`absolute z-30 h-full w-full origin-bottom transition-all duration-300 ease-in-out bg-[var(--folder-color)] ${
              !open ? 'group-hover:[transform:skew(-15deg)_scaleY(0.6)]' : ''
            }`}
            style={{
              borderRadius: '5px 10px 10px 10px',
              ...(open && { transform: 'skew(-15deg) scaleY(0.6)' }),
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Folder;