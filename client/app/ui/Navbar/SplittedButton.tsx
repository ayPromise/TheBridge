import React from 'react';
import classes from './SplittedButton.module.css'
import { Link } from 'react-router';

interface SplitButtonProps {
    pathName: string;
}

const SplitButton: React.FC<SplitButtonProps> = ({ pathName }) => {

    return (
        <div className={classes.buttonContainer}>
            <div className={`${classes.leftButton} ${classes.baseButton} ${pathName === '/sign-in' ? classes.active : ''}`}>
                <Link to={'/sign-in'} className={classes.textContent}>
                    Sign in
                </Link>
            </div>
            <div className={`${classes.rightButton} ${classes.baseButton} ${pathName === '/sign-up' ? classes.active : ''}`}>
                <Link to={'/sign-up'} className={classes.textContent}>
                    Sign up
                </Link>
            </div>
        </div>
    );
};

export default SplitButton;
