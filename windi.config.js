import colors from 'windicss/colors'


export default {
  theme: {
    extend: {
      colors: {
        theme: '#409eff',
        info: colors.gray['400'],
        muted: colors.gray['300'],
        background: colors.blueGray['100']
      },
    }
  },
  shortcuts: {
    'center-flex': 'flex items-center',
    'single-form': 'max-w-125 mx-auto pt-5 px-2'
  }
}
