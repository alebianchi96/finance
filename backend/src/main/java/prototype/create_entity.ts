const baseProjectDirectory : string = '../com/it/finance/personal_finance_be'

const adapterDir : string = `${baseProjectDirectory}/adapter`
const controllerDir : string = `${baseProjectDirectory}/controller`
const daoDir : string = `${baseProjectDirectory}/dao`
const dtoDir : string = `${baseProjectDirectory}/dto`
const entityDir : string = `${baseProjectDirectory}/entity`
const serviceDir : string = `${baseProjectDirectory}/service`

// Parametri in input
// console.log('process.args', process.argv.splice(2));
let argsFunction = process.argv.splice(2);

let entityName : string = "";
let entityType : string = "";
let dbTableName : string = "";

if( argsFunction && argsFunction.length > 2 ) {
    entityName = argsFunction[0]; // example: 'EconomicCategoryEntity'
    entityType = argsFunction[1]; // example: 'PfTypoEntity' | 'PfEntity'
    dbTableName = argsFunction[2]; // example: 'economic_categories'
} else {
    // Ask user for input entityName, entityType, dbTableName
    entityName = prompt('> Enter @entityName [ex: EconomicCategoryEntity]: '); // example: 'EconomicCategoryEntity'
    entityType = prompt('> Enter @entityType [1-PfEntity, 2-PfTypoEntity]: '); // example: 'PfTypoEntity' | 'PfEntity'
    dbTableName = prompt('> Enter @dbTableName [ex: economic_categories]: '); // example: 'economic_categories'
}

// Pulizia e controllo input
let functionName = entityName.replace('Entity', '').trim();
entityType = entityType.trim();
let dtoType = "";
let adapterType = "";

if('1'===entityType || 'PfEntity' === entityType) {
    entityType = 'PfEntity';
    dtoType="PfDto"
    adapterType = "PfAdapter";
} else if ('2'===entityType || 'PfTypoEntity' === entityType) {
    entityType = 'PfTypoEntity';
    dtoType="PfTypoDto"
    adapterType = "PfTypoAdapter";
} else {
    console.error('[ERROR] Invalid entityType. Please provide either "1" for PfEntity or "2" for PfTypoEntity.');
    process.exit(1);
}

dbTableName= dbTableName.trim();

if(!functionName || !entityType || !dbTableName) {
    console.error('[ERROR] Invalid input parameters. Please provide valid entityName, entityType, and dbTableName.');
    process.exit(1);
}

console.log(" ");
console.info("[INFO] INIT > Creating entity files...", {
    entityName,
    entityType,
    dbTableName
});
console.log(" ");

let checkParams : string = prompt('> If params are incorrect select "0", else give any other input value.. ');
if(checkParams === '0') {
    console.error('[ERROR] Invalid parameters. Exiting...');
    process.exit(1);
}
console.log(" ");

// 1. ./entity/**Entity.java
let entityClassName = `${functionName}Entity`;
await createEntity(entityDir, entityClassName, entityType, dbTableName);
console.info("@ENTITY --> " + entityClassName);

// 2. ./dto/**Dto.java
let dtoClassName = `${functionName}Dto`;
await createDto(dtoDir, dtoType, dtoClassName);
console.info("@DTO --> " + dtoClassName);

// 3. ./dao/**JpaRepo.java
let repoClassName = `${functionName}JpaRepo`;
await createRepo(daoDir, repoClassName, entityClassName);
console.info("@REPO --> " + repoClassName);

// 4. ./adapter/**Adapter.java
let adapterClassName = `${functionName}Adapter`;
await createAdapter(adapterDir, adapterClassName,
    entityClassName,
    dtoClassName,
    adapterType);
console.info("@ADAPTER --> " + adapterClassName);

// 5. ./service/**Service.java
let serviceClassName = `${functionName}Service`;
await createService(serviceDir, serviceClassName,
    entityClassName,
    dtoClassName,
    adapterClassName,
    repoClassName)
console.info("@SERVICE --> " + serviceClassName);


// 6. ./controller/**Controller.java
let controllerClassName = `${functionName}Controller`;
await createController(controllerDir, controllerClassName,
    entityClassName,
    dtoClassName,
    serviceClassName,
    dbTableName.replace(/_/g, '-').toLowerCase());
console.info("@CONTROLLER --> " + controllerClassName);


console.log(" ");
console.info("[INFO] DONE > Entity files created successfully!");

console.log(" ");

console.log("Actions to do manually:")
console.log("1. [ENTITY] add specific fields of the entity");
console.log("2. [ENTITY] define ExampleMatcher in the entity class");
console.log("3. [DTO] add specific fields of the entity");
console.log("4. [ADAPTER] map fields from and to entity");
console.log("5. [ADAPTER] map fields for edit form");
console.log("6. [SERVICE] implement methods...");

console.log(" ");

async function createEntity(fullPath: string, className:string, entityType:string, dbTableName:string) {

    let content = `package com.it.finance.personal_finance_be.entity;

import com.it.finance.personal_finance_be.framework.${entityType};
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import org.springframework.data.domain.ExampleMatcher;

@Entity
@Table(name = "${dbTableName}")
public class ${className} extends ${entityType} {

    // TODO ale -> aggiungere eventuali altri campi

    @Override
    public ExampleMatcher generateExample() {
        return ExampleMatcher.matchingAll()
                .withMatcher("id", ExampleMatcher.GenericPropertyMatchers.exact())
                // TODO ale -> definisci i matchers specifici
                /*
                    .withMatcher("label", ExampleMatcher.GenericPropertyMatchers.ignoreCase().contains())
                    .withMatcher("code", ExampleMatcher.GenericPropertyMatchers.ignoreCase().contains())
                    .withMatcher("nature", ExampleMatcher.GenericPropertyMatchers.exact())
                */
                ;
    }
    
}
`
    await Bun.write(`${fullPath}/${className}.java`, content);

}

async function createDto(fullPath: string, dtoType:string, className:string) {

    let content = `package com.it.finance.personal_finance_be.dto;

import com.it.finance.personal_finance_be.framework.${dtoType};

public class ${className} extends ${dtoType} {

    // TODO ale -> aggiungere eventuali altri campi

}
`;
    await Bun.write(`${fullPath}/${className}.java`, content);
}

async function createRepo(fullPath: string, className:string, entityClassName:string) {

    let content = `package com.it.finance.personal_finance_be.dao;

import com.it.finance.personal_finance_be.entity.${entityClassName};
import com.it.finance.personal_finance_be.framework.PfRepository;

public interface ${className} extends PfRepository<${entityClassName}> {

}
`;

    await Bun.write(`${fullPath}/${className}.java`, content);

}

async function createService(fullPath: string, className:string,
                             entityClassName:string,
                             dtoClassName:string,
                             adapterClassName:string,
                             repoClassName:string) {

    let content = `package com.it.finance.personal_finance_be.service;

import com.it.finance.personal_finance_be.adapter.${adapterClassName};
import com.it.finance.personal_finance_be.dao.${repoClassName};
import com.it.finance.personal_finance_be.dto.${dtoClassName};
import com.it.finance.personal_finance_be.entity.${entityClassName};
import com.it.finance.personal_finance_be.framework.IPfAdapter;
import com.it.finance.personal_finance_be.framework.PfRepository;
import com.it.finance.personal_finance_be.framework.PfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ${className} extends PfService<${entityClassName}, ${dtoClassName}> {

    @Autowired
    private ${repoClassName} repository;

    @Autowired
    private ${adapterClassName} adapter;

    @Override
    protected PfRepository<${entityClassName}> getRepository() {
        return repository;
    }

    @Override
    protected IPfAdapter<${entityClassName}, ${dtoClassName}> getAdapter() {
        return adapter;
    }

    @Override
    public boolean existItem(${entityClassName} entity) {
        return false; // TODO ale
    }

    @Override
    public boolean checkInsertFields(${entityClassName} entity) {
        return false; // TODO ale
    }

    @Override
    public boolean checkEditFields(${entityClassName} entity) {
        return false; // TODO ale
    }

    @Override
    public boolean checkDeleteCondition(${entityClassName} entity) {
        return false; // TODO ale
    }

}
`

    await Bun.write(`${fullPath}/${className}.java`, content);

}

async function createAdapter(fullPath: string, className:string,
                             entityClassName:string,
                             dtoClassName:string,
                             adapterType:string) {

    let content = `package com.it.finance.personal_finance_be.adapter;

import com.it.finance.personal_finance_be.dto.${dtoClassName};
import com.it.finance.personal_finance_be.entity.${entityClassName};
import com.it.finance.personal_finance_be.framework.${adapterType};
import org.springframework.stereotype.Component;

@Component
public class ${className} extends ${adapterType}<${entityClassName}, ${dtoClassName}> {

    protected ${className}() {
        super(${entityClassName}.class, ${dtoClassName}.class);
    }

    @Override
    public ${entityClassName} toEntity(${dtoClassName} dto) {
        ${entityClassName} entity = super.toEntity(dto);
        if (entity == null) {
            return null; // Handle null Entity case
        }
        return entity;

    }

    @Override
    public ${dtoClassName} toDto(${entityClassName} entity) {
        ${dtoClassName} dto = super.toDto(entity);
        if (dto == null) {
            return null; // Handle null DTO case
        }
        return dto;
    }


    @Override
    public void evaluateForEdit(${entityClassName} entity, ${dtoClassName} dto) {
        // TODO ale
    }

}
`

    await Bun.write(`${fullPath}/${className}.java`, content);

}

async function createController(fullPath: string, className:string,
                                entityClassName:string,
                                dtoClassName:string,
                                serviceClassName:string,
                                controllerBasePath:string) {

    let content = `
package com.it.finance.personal_finance_be.controller;

import com.it.finance.personal_finance_be.dto.${dtoClassName};
import com.it.finance.personal_finance_be.entity.${entityClassName};
import com.it.finance.personal_finance_be.framework.*;
import com.it.finance.personal_finance_be.service.${serviceClassName};
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/${controllerBasePath}")
public class ${className} extends PfController<${entityClassName}, ${dtoClassName}> {

    @Autowired
    private ${serviceClassName} service;

    @Override
    protected PfService<${entityClassName}, ${dtoClassName}> getService() {
        return service;
    }

    @Override
    @GetMapping("/id/{id}")
    public ResponseEntity<PfObjectApiResponse<${dtoClassName}>> apiFindById(@PathVariable Long id) {
        return super.findById(id);
    }

    @Override
    @GetMapping("/all")
    public ResponseEntity<PfListApiResponse<${dtoClassName}>> apiFindAll() {
        return super.findAll();
    }

    @Override
    @PostMapping("/search")
    public ResponseEntity<PfObjectApiResponse<SearchResponseDto<${dtoClassName}>>> apiSearch(@RequestBody SearchRequestDto<${dtoClassName}> searchRequest) {
        return super.search(searchRequest);
    }

    @Override
    @PostMapping("/insert")
    public ResponseEntity<PfObjectApiResponse<${dtoClassName}>> apiInsert(@RequestBody ${dtoClassName} dto) {
        return super.insert(dto);
    }

    @Override
    @PutMapping("/edit")
    public ResponseEntity<PfObjectApiResponse<${dtoClassName}>> apiEdit(@RequestBody ${dtoClassName} dto) {
        return super.edit(dto);
    }

    @Override
    @DeleteMapping("/id/{id}")
    public ResponseEntity<PfObjectApiResponse<Void>> apiDelete(@PathVariable Long id) {
        return super.delete(id);
    }

}
`;

    await Bun.write(`${fullPath}/${className}.java`, content);

}
