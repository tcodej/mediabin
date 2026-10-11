import { useEffect, useState } from 'react';

export default function Passcode({ onUnlock }) {
  const [entered, setEntered] = useState('');
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(false);

  const code = import.meta.env.VITE_PASSCODE;
  const isTouchDevice = navigator.maxTouchPoints > 0;
  const numbers = isTouchDevice ? ['1','2','3','4','5','6','7','8','9','0'] : ['7','8','9','4','5','6','1','2','3','0'];

  useEffect(() => {
    if (code == 'xxxx') {
      unlock();
      return;
    }

    if (window) {
      window.addEventListener('keyup', handleKeyUp);
    }

    return () => {
      if (window) {
        window.removeEventListener('keyup', handleKeyUp);
      }
    }
  }, []);

  const handleKeyUp = (e) => {
    if (numbers.includes(e.key)) {
      press(e.key);
      setActive(e.key);

      window.setTimeout(() => {
        setActive(false);
      }, 100);
    }
  }

  const press = (num) => {
    setEntered((prev) => {
      let test = prev + num;

      // later make this an api call, for now secure enough for me! 
      if (test === code) {
        unlock();

      } else if (test.length >= code.length) {
        fail();
      }

      return test;
    });
  }

  const fail = () => {
    setFailed(true);
    setTimeout(() => {
      setEntered('');
      setFailed(false);
    }, 750);
  }

  const unlock = () => {
    sessionStorage.setItem('authenticated', true);
    setTimeout(onUnlock, 500);
  }

  const dot = () => {
    return <div className="dot">&bull;</div>
  }

  return (
    <div id="passcode">
      <div className={'panel'+ (failed ? ' wiggle' : '')}>
        <div className={'dots'}>
        { entered.split('').map((x, i) => {
          return <div key={'dot'+ i}>{dot()}</div>
        })}
        </div>
        <div className="buttons">
        {
          numbers.map((num) => {
            return <button key={'num'+ num} className={num === active ? 'active' : ''} onClick={() => press(num)} type="button">{num}</button>
          })
        }
        </div>
      </div>
    </div>
  );
}
