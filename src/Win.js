import { useState } from 'react';
import { animated } from 'react-spring';

export default function Win({ children, x, y, width, height, title, lock, resizeable, body_style, animation_styles }) {
    if (lock === undefined) lock = false


    const page_height = window.innerHeight;
    const page_width = window.innerWidth;

    const [size, setSize] = useState({
        w: width || 300,
        h: height || 200
    })
    const [mousePressed, setMousePressed] = useState(false)
    const [pos, setPos] = useState({
        top: y || (page_width - size.w) / 2,
        left: x || (page_height - size.h) / 2,
    })
    const [cursor, setCursor] = useState('default')
    const [win_title] = useState(title || 'title')


    const handel_move = e => {
        if (mousePressed)
            window.move_window = move_window
        else
            window.move_window = null
    }

    const move_window = () => {
        if (lock) return
        if (cursor !== 'default') return
        const { mouseX, mouseY } = window;

        setPos({
            left: (mouseX - size.w / 2),
            top: (mouseY - 20),
        })
    }

    const handel_window_mouse_move = e => {
        if (!resizeable) return

        const { clientX, clientY } = e;


        const left_start = pos.left;
        const top_start = pos.top;
        const left_end = pos.left + size.w;
        const top_end = pos.top + size.h;

        console.log(clientY, top_start, top_end);

        if (Math.abs(clientX - left_end) < 10) { // border right
            setCursor('col-resize')

            window.resize_window = () => {
                if (window.mousePressed) {
                    setSize(oldSize => ({
                        w: window.mouseX - left_start,
                        h: oldSize.h
                    }))
                } else {
                    window.resize_window = null
                }
            }

        }

        else if (Math.abs(clientX - left_start) < 10) { // border left
            setCursor('col-resize')
            window.resize_window = () => {
                if (window.mousePressed) {
                    const ww = size.w;
                    setSize(oldSize => ({
                        w: left_end - window.mouseX,
                        h: oldSize.h
                    }))
                    setPos(oldPos => ({
                        top: oldPos.top,
                        left: (pos.left + (ww - left_end + window.mouseX))
                    }))
                } else {
                    window.resize_window = null
                }
            }
        }

        else if (Math.abs(clientY - top_end) < 5) { // border bottom
            setCursor('row-resize')
            window.resize_window = () => {
                if (window.mousePressed) {
                    setSize(oldSize => ({
                        w: oldSize.w,
                        h: window.mouseY - top_start,
                    }))
                } else {
                    window.resize_window = null
                }
            }
        }

        else {
            if (cursor !== 'default') {
                setCursor('default')
            }
        }
    }

    return (
        <animated.div
            onMouseMove={handel_window_mouse_move}
            className={`window ${mousePressed && !lock ? "" : "animate-window"}`} style={{
                ...animation_styles,
                top: animation_styles.top.to(v => (animation_styles.top.isAnimating ? v : pos.top)),
                left: pos.left,
                width: size.w,
                height: animation_styles.height.to(v => (animation_styles.height.isAnimating ? v : size.h)),
                fontSize: `min( 1rem ,${size.w / 20}px)`,
                overflowY: 'hidden',
                cursor,
            }}>
            <div
                draggable={false}
                onMouseDown={() => setMousePressed(true)}
                onMouseUp={() => setMousePressed(false)}
                onMouseMove={handel_move}
                className="win-head">
                <div className="win-ops">
                    <div className='win-close'></div>
                </div>
                <div className="win-title">
                    <span>{win_title}</span>
                </div>
            </div>
            <div className="win-body" style={body_style}>
                {children}
            </div>
        </animated.div>
    )
}