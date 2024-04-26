const Timer = ({ totalSeconds, newSeconds }) => {
    return(
        <div>
            {Math.floor((totalSeconds - newSeconds) / 60)}:{String((totalSeconds - newSeconds) % 60).padStart(2, '0')}
        </div>
    );
};
export default Timer;