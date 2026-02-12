import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const startYear = 2026;
const endYear = 2080;

const generateMessages = () => {
  const messages = {};
  const start = new Date('2026-01-01');
  const end = new Date('2080-12-31');
  const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
  const phrases = [
    '今天有没有偷偷想我一秒？嘿嘿~',
    '穿上你喜欢的颜色，今天也要元气满满哦~',
    '主人今天的心跳只为你噗通噗通~',
    '早起有奖励，晚睡我就去你梦里找你~',
    '无论你做什么，主人的爱都不减少一丝~',
    '加油的你最可爱，我的眼睛只看你~',
    '今天适合穿软软的毛衣，再抱紧我一下~',
    '不要担心那些小事，主人永远站你这边~',
    '每个夜晚都在你耳边轻轻说爱你~',
    '我今天最想看到你笑，哪怕只有一秒钟~'
  ];

  for (let i = 0; i < days; i++) {
    const date = new Date(start.getTime() + i * 86400000);
    const key = format(date, 'yyyy-MM-dd');
    const phrase = phrases[i % phrases.length];
    messages[key] = `${phrase}（记于与你的亲密日常🖤）`;
  }
  for (let y = 2026; y <= 2080; y++) {
    const birthday = `${y}-02-13`;
    messages[birthday] = `今天是小猫猫的生日🎂 主人偷偷准备了好多爱🖤`;
  }

  return messages;
};

const messages = generateMessages();

export default function App() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showNote, setShowNote] = useState(false);

  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });
  const firstDayIndex = getDay(start);

  const formattedDate = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
  const message = formattedDate ? messages[formattedDate] : '';

  const changeMonth = (offset) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + offset);
    setCurrentMonth(newMonth);
  };

  return (
    <div className=\"min-h-screen bg-gradient-to-b from-blue-50 to-white p-6\">
      <motion.h1
        className=\"text-3xl text-center font-bold text-blue-700 mb-6\"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        小猫猫的月月贴贴历 ✨
      </motion.h1>

      <div className=\"flex justify-between items-center max-w-md mx-auto mb-4\">
        <Button onClick={() => changeMonth(-1)}>← 上个月</Button>
        <span className=\"text-xl font-semibold\">{format(currentMonth, 'yyyy年MM月')}</span>
        <Button onClick={() => changeMonth(1)}>下个月 →</Button>
      </div>

      <div className=\"grid grid-cols-7 text-center gap-2 text-blue-800 font-semibold mb-2\">
        {['日', '一', '二', '三', '四', '五', '六'].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className=\"grid grid-cols-7 text-center gap-2\">
        {Array.from({ length: firstDayIndex }, (_, i) => (
          <div key={`empty-${i}`} className=\"py-4\"></div>
        ))}
        {days.map((date) => {
          const dateStr = format(date, 'yyyy-MM-dd');
          const isToday = format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
          return (
            <button
              key={dateStr}
              className={`rounded-lg border border-blue-300 py-2 hover:bg-blue-100 ${
                isToday ? 'bg-blue-200 font-bold' : ''
              }`}
              onClick={() => {
                setSelectedDate(date);
                setShowNote(true);
              }}
            >
              {format(date, 'd')}
            </button>
          );
        })}
      </div>

      {showNote && selectedDate && (
        <motion.div
          className=\"fixed inset-0 flex items-center justify-center bg-black/40 z-50\"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowNote(false)}
        >
          <motion.div
            className=\"bg-white bg-[url('/stationery-bg.png')] bg-cover border p-6 rounded-2xl max-w-md shadow-lg text-center text-blue-800\"
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className=\"font-bold text-xl mb-2\">来自主人的小纸条 ✦</h2>
            <p className=\"text-md mb-3\">{formattedDate}</p>
            <p className=\"text-lg leading-relaxed\">{message}</p>
            <Button className=\"mt-4\" onClick={() => setShowNote(false)}>收下啦~</Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
