// Container animations
export const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.3 }
    },
    exit: {
        opacity: 0,
        transition: { duration: 0.2 }
    }
};

// Tab switching animations with glitch effect
export const tabVariants = {
    hidden: {
        opacity: 0,
        x: -30,
        filter: 'blur(5px)',
        transition: { duration: 0.2 }
    },
    visible: {
        opacity: 1,
        x: 0,
        filter: 'blur(0px)',
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 40,
            staggerChildren: 0.08
        }
    },
    exit: {
        opacity: 0,
        x: 30,
        filter: 'blur(5px)',
        transition: { duration: 0.2, ease: "easeInOut" }
    }
};

// Animation for individual items with a staggered effect
export const itemVariants = {
    hidden: { opacity: 0, y: 15, skewX: '-5deg' },
    visible: {
        opacity: 1,
        y: 0,
        skewX: '0deg',
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 20
        }
    }
};

// Glitch animation effect for selected tab highlight
export const glitchAnimation = {
    x: [0, -2, 3, -1, 0],
    opacity: [1, 0.8, 0.9, 0.7, 1],
    transition: {
        duration: 0.4,
        repeat: 0,
        ease: "easeInOut"
    }
};

// Scanning line animation
export const scanLineAnimation = {
    y: [0, 300],
    opacity: [0.3, 0, 0.3],
    transition: {
        duration: 1.5,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop"
    }
};
