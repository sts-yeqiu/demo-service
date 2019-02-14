import { Document, Schema, HookNextFunction, Model } from "mongoose";
var bcrypt = require("bcrypt");

const SALT_WORK_FACTOR = 10;

/**
 * 会员用户模型
 */
export var MemberUserSchema: Schema = new Schema({
    isActive: { type: Boolean, default: true }, //是否激活
    roles: [{ type: String }], //角色（管理员:admin）
    name: { type: String }, //姓名
    loginName: { type: String }, //登陆名
    password: { type: String }, //密码
    basicInfo: {
        gender: { type: String }, //性别（男:male 女:female）
        identityNumber: { type: String }, //身份证号
        mobile: { type: String }, //手机号
        email: { type: String } //邮箱
    }, //基本信息
    meta: {
        createBy: { type: Schema.Types.ObjectId, ref: "memberUser" }, //创建人
        createDate: { type: Date, default: Date.now }, //创建时间
        updateBy: { type: Schema.Types.ObjectId, ref: "memberUser" }, //更新人
        updateDate: { type: Date } //更新时间
    } //元数据
}, { collection: "memberUser" });//collection name

//索引
MemberUserSchema.index({ memberId: 1, loginName: 1 });

/**
 * Hash user's password
 *
 */
MemberUserSchema.pre("save", function (next: HookNextFunction) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified("password")) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err: any, salt: any) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.get("password"), salt, function (err: any, hash: any) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.set("password", hash);
            next();
        });
    });
});

/**
 * Create an Instance method to validate user's password
 * This method will be used to compare the given password with the password stored in the database
 * 
 */
MemberUserSchema.methods.validatePassword = function (password: string, callback: any) {
    bcrypt.compare(password, this.password, (err: any, isMatch: boolean) => {
        if (err) {
            return callback(err);
        }
        callback(null, isMatch);
    });
};

MemberUserSchema.statics.findByName = function () {
    console.log("static method test...");
};

export interface IMemberUser extends Document {
    isActive: boolean; //是否激活
    roles: [string]; //角色（管理员:admin）
    name: string; //姓名
    loginName: string; //登陆名
    password: string; //密码
    basicInfo: {
        gender: string; //性别（男:male 女:female）
        identityNumber: string; //身份证号
        mobile: string; //手机号
        email: string; //邮箱
    }; //基本信息
    meta: {
        createBy: any; //创建人
        createDate: Date; //创建时间
        updateBy: any; //更新人
        updateDate: Date; //更新时间
    }; //元数据
    validatePassword: (password: string, callback: any) => void; // 验证密码
}

interface IMemberUserEx extends Model<IMemberUser> {
    findByName: () => string;
}