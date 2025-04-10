import http from './request'

export const getSelects = async () => {
    const data = await http('/carnival/clock_api/getlevelselect', {
        method: 'GET',
    })
    console.log('data--', data)
}
