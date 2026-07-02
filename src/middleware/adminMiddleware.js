//Проверка является ли пользователь админом
//Только админ может добавлять/редактировать/удалять ресурсы
const adminMiddleware = (req, res, next) => {

    if (req.user.role !== "admin") {
        return res.status(403).json({
            message: "Доступ запрещён"
        });
    }

    next();

};

export default adminMiddleware;