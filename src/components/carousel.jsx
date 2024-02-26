import { useEffect, useState, useRef} from 'react';

export default function Carousel({ gallery }) {
	const slider = useRef(null);

	const total = gallery.images && gallery.images.length;
	const distance = 100;
	const threshold = 50;    // distance of drag before triggering slider movement

	const [ sliderStyles, setSliderStyles ] = useState({ 'left': '0' });
	const [ sliderClasses, setSliderClasses ] = useState('slide-container');
	const [ prevClasses, setPrevClasses ] = useState('btn-prev');
	const [ nextClasses, setNextClasses ] = useState('btn-next');
	const [ gridView, setGridView ] = useState(false);
	const [ showControls, setShowControls ] = useState(true);
	const [ move, setMove ] = useState({
		active: false,
		left: 0,
		startX: 0,
		dist: 0,
		thresholdReached: false
	});

	let [current, setCurrent] = useState(0);

	const onKeyDown = (e) => {
		if (gridView) {
			return;
		}

		switch (e.key) {
			case 'ArrowRight':
				slideTo('next');
			break;

			case 'ArrowLeft':
				slideTo('prev');
			break;

			default:
				// nothing
			break;
		}
	}

	useEffect(() => {
		if (total < 2) {
			setShowControls(false);
			setGridView(true);

		} else {
			slideTo(0);
		}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [total]);

	useEffect(() => {
		document.addEventListener('keydown', onKeyDown);

		return () => {
			document.removeEventListener('keydown', onKeyDown);
		};

	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gridView]);

	const updateMove = (newVals) => {
		setMove(prevVals => {
			return ({
				...prevVals,
				...newVals
			})
		});
	}

	const onCarouselButtonClick = () => {
		if (gridView) {
			// show regular carousel view
			setGridView(false);
			setSliderClasses('slide-container');

		} else {
			// show grid view
			setGridView(true);
			setSliderClasses('slide-container is-active grid');
			slideTo(0);
		}
	}

	const onPrevButtonClick = () => {
		slideTo('prev');
	}

	const onNextButtonClick = () => {
		slideTo('next');
	}

	const slideTo = (val) => {
		if (val === undefined) {
			val = current;
		}

		if (val === 'prev') {
			val = current - 1;
		}

		if (val === 'next') {
			val = current + 1;
		}

		if (val < 0) {
			val = 0;
		}

		if (val >= total) {
			val = total - 1;
		}

		current = val;
		setCurrent(current);

		// reset
		setPrevClasses('btn-prev');
		setNextClasses('btn-next');

		if (current === 0) {
			setPrevClasses('btn-prev is-disabled');
		}

		if (current === total - 1) {
			setNextClasses('btn-next is-disabled');
		}

		setSliderStyles({ 'left': -(current * distance) +'%' });
	};

	const onDragStart = (e) => {
		if (gridView) return;

		updateMove({ active: true });
		setSliderClasses('slide-container is-active');

		let touchEvt = e.touches ? e.touches[0] : e;
		let left = 0;

		if (slider.current && slider.current.style) {
			left = parseInt(slider.current.style.left, 10);
		}

		updateMove({
			active: true,
			left: left,
			startX: touchEvt.clientX,
			dist: 0
		});
	};

	const onDrag = (e) => {
		if (gridView) return;

		if (move.active === true) {
			let touchEvt = e.touches ? e.touches[0] : e;

			updateMove({
				dist: touchEvt.clientX - move.startX
			});

			if (Math.abs(move.dist) > threshold || move.thresholdReached) {
				updateMove({ thresholdReached: true });
				setSliderStyles({ 'left': 'calc('+ move.left +'% + '+ move.dist +'px)' });
			}
		}
	};

	const onDragEnd = () => {
		if (gridView || move.active === false) return;

		setSliderClasses('slide-container');
		updateMove({
			active: false,
			thresholdReached: false
		});

		if (move.dist < -threshold) {
			setCurrent(current++);
			if (current > total - 1) setCurrent(total - 1);
			slideTo(current);

		} else if (move.dist > threshold) {
			setCurrent(current--);
			if (current < 0) setCurrent(0);
			slideTo(current);
		}
	};

	// switch to slideshow mode and jump to the clicked slide
	// only works in grid mode
	const openSlide = (index) => {
		if (gridView === false) {
			return;
		}

		onCarouselButtonClick();
		slideTo(index);
	}

	return (
		<div className="section-carousel">

			<div className="header">
				{ showControls && (
					<div className="view-btns">
						<button
							type="button"
							className={`btn-carousel ${!gridView && 'is-active'}`}
							onClick={onCarouselButtonClick}
						>
							Carousel
						</button>
					</div>
				)}

				{ !gridView && (
					<div className="controls">
						<button
							type="button"
							className={prevClasses}
							onClick={onPrevButtonClick}
						>
							Previous
						</button>
						<div className="counter">{current+1} / {total}</div>
						<button
							type="button"
							className={nextClasses}
							onClick={onNextButtonClick}
						>
							Next
						</button>
					</div>
				)}
			</div>

			<div
				className="carousel"
				onTouchStart={onDragStart}
				onTouchMove={onDrag}
				onTouchEnd={onDragEnd}
				onMouseDown={onDragStart}
				onMouseMove={onDrag}
				onMouseUp={onDragEnd}
			>
				<div
					ref={slider}
					className={sliderClasses}
					style={sliderStyles}
				>

					{ gallery.images.map((slide, i) => {
						return (
							<div key={i} className="slide">
								<img
									src={slide.uri}
									alt={`Slide ${i+1}`}
									draggable="false"
									onClick={() => openSlide(i)}
								/>
							</div>
						)
					})}

				</div>
			</div>
		</div>
	);
}