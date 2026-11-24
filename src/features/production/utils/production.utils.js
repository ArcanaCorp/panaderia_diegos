export const formatDate = (date) => {

    if (!date) return '-';

    return new Date(date).toLocaleString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });

};

export const getStatusLabel = (status) => {

    const labels = {
        pendiente: 'Pendiente',
        proceso: 'En producción',
        terminado: 'Terminado',
        diseño: 'Diseño',
        finalizado: 'Finalizado',
    };

    return labels[status] || status;

};

export const getPriorityLabel = (priority) => {

    const labels = {
        baja: 'Baja',
        normal: 'Normal',
        alta: 'Alta',
        urgente: 'Urgente',
    };

    return labels[priority] || priority;

};

export const getPriorityClass = (priority) => {

    if (priority === 'urgente') return 'badge badge--danger';

    if (priority === 'alta') return 'badge badge--warning';

    return 'badge badge--neutral';

};

export const getStatusClass = (status) => {

    if (status === 'terminado' || status === 'finalizado') return 'badge badge--success';
        
    if (status === 'proceso') return 'badge badge--info';

    if (status === 'diseño') return 'badge badge--neutral';

    return 'badge badge--warning';

};