/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
    colors: {
        primary: {
            '50': 'hsl(216, 98%, 97%)',
            '100': 'hsl(216, 98%, 94%)',
            '200': 'hsl(216, 98%, 86%)',
            '300': 'hsl(216, 98%, 76%)',
            '400': 'hsl(216, 98%, 64%)',
            '500': 'hsl(216, 98%, 50%)',
            '600': 'hsl(216, 98%, 40%)',
            '700': 'hsl(216, 98%, 32%)',
            '800': 'hsl(216, 98%, 24%)',
            '900': 'hsl(216, 98%, 16%)',
            '950': 'hsl(216, 98%, 10%)',
            DEFAULT: '#0d6efd'
        },
        secondary: {
            '50': 'hsl(45, 100%, 97%)',
            '100': 'hsl(45, 100%, 94%)',
            '200': 'hsl(45, 100%, 86%)',
            '300': 'hsl(45, 100%, 76%)',
            '400': 'hsl(45, 100%, 64%)',
            '500': 'hsl(45, 100%, 50%)',
            '600': 'hsl(45, 100%, 40%)',
            '700': 'hsl(45, 100%, 32%)',
            '800': 'hsl(45, 100%, 24%)',
            '900': 'hsl(45, 100%, 16%)',
            '950': 'hsl(45, 100%, 10%)',
            DEFAULT: '#ffc107'
        },
        accent: {
            '50': 'hsl(190, 90%, 97%)',
            '100': 'hsl(190, 90%, 94%)',
            '200': 'hsl(190, 90%, 86%)',
            '300': 'hsl(190, 90%, 76%)',
            '400': 'hsl(190, 90%, 64%)',
            '500': 'hsl(190, 90%, 50%)',
            '600': 'hsl(190, 90%, 40%)',
            '700': 'hsl(190, 90%, 32%)',
            '800': 'hsl(190, 90%, 24%)',
            '900': 'hsl(190, 90%, 16%)',
            '950': 'hsl(190, 90%, 10%)',
            DEFAULT: '#0dcaf0'
        },
        'neutral-50': '#2d3748',
        'neutral-100': '#ffffff',
        'neutral-200': '#212529',
        'neutral-300': '#000000',
        'neutral-400': '#64748b',
        'neutral-500': '#6c757d',
        'neutral-600': '#4f5d78',
        background: '#f8f9fa',
        foreground: '#000000'
    },
    fontFamily: {
        sans: [
            'Inter',
            'sans-serif'
        ],
        heading: [
            'Segoe UI',
            'sans-serif'
        ]
    },
    fontSize: {
        '10': [
            '10px',
            {
                lineHeight: '16px',
                letterSpacing: '1px'
            }
        ],
        '12': [
            '12px',
            {
                lineHeight: '19.2px'
            }
        ],
        '13': [
            '13px',
            {
                lineHeight: '16.9px'
            }
        ],
        '14': [
            '14px',
            {
                lineHeight: '22.4px'
            }
        ],
        '15': [
            '15px',
            {
                lineHeight: '18px'
            }
        ],
        '16': [
            '16px',
            {
                lineHeight: 'normal'
            }
        ],
        '18': [
            '18px',
            {
                lineHeight: '28.8px'
            }
        ],
        '20': [
            '20px',
            {
                lineHeight: '32px'
            }
        ],
        '24': [
            '24px',
            {
                lineHeight: '28.8px'
            }
        ],
        '30.4': [
            '30.4px',
            {
                lineHeight: '36.48px'
            }
        ],
        '19.2': [
            '19.2px',
            {
                lineHeight: '28.8px'
            }
        ],
        '17.6': [
            '17.6px',
            {
                lineHeight: '28.16px'
            }
        ],
        '15.2': [
            '15.2px',
            {
                lineHeight: '22.8px'
            }
        ],
        '14.4': [
            '14.4px',
            {
                lineHeight: '23.04px',
                letterSpacing: '1px'
            }
        ],
        '13.6': [
            '13.6px',
            {
                lineHeight: '21.76px'
            }
        ]
    },
    spacing: {
        '1': '2px',
        '6': '12px',
        '12': '24px',
        '14': '28px',
        '16': '32px',
        '20': '40px',
        '35': '70px'
    },
    borderRadius: {
        md: '10px',
        lg: '16px'
    },
    boxShadow: {
        sm: 'rgba(0, 0, 0, 0.075) 0px 2px 4px 0px',
        md: 'rgba(0, 0, 0, 0.1) 0px 4px 12px 0px',
        xl: 'rgba(102, 126, 234, 0.08) 0px 25px 60px 0px'
    },
    screens: {
        lg: '992px',
        '1200px': '1200px',
        '1400px': '1400px'
    },
    transitionDuration: {
        '150': '0.15s',
        '200': '0.2s',
        '300': '0.3s'
    },
    transitionTimingFunction: {
        default: 'ease',
        custom: 'cubic-bezier(0.4, 0, 0.2, 1)',
        linear: 'linear'
    },
    container: {
        center: true,
        padding: '0px'
    },
    maxWidth: {
        container: '100%'
    }
},
  },
};
